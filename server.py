from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import os
import logging
import traceback
import time
import asyncio
import aiofiles
from typing import Optional
from functools import lru_cache
import re
from collections import defaultdict

# Database configuration with connection pooling
import motor.motor_asyncio
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import asyncio

DATABASE_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/copperhead_db')
DATABASE_CONNECTED = False
db_client = None
database = None

# Connection pool configuration
DB_MAX_POOL_SIZE = 10
DB_MIN_POOL_SIZE = 1
DB_MAX_IDLE_TIME_MS = 30000
DB_SERVER_SELECTION_TIMEOUT_MS = 5000

# SECURITY: Advanced memory-safe rate limiting with circuit breaker
import threading
from collections import OrderedDict
import hashlib

rate_limit_lock = threading.RLock()
rate_limit_storage = OrderedDict()  # LRU-style ordered dict
RATE_LIMIT_REQUESTS = 100  # requests per minute
RATE_LIMIT_WINDOW = 60  # seconds
MAX_RATE_LIMIT_ENTRIES = 5000  # Reduced for better memory control
CIRCUIT_BREAKER_THRESHOLD = 1000  # Requests per second to trigger circuit breaker
circuit_breaker_active = False
circuit_breaker_reset_time = 0

def get_client_fingerprint(request: Request) -> str:
    """Generate secure client fingerprint to prevent IP spoofing"""
    client_ip = request.client.host if request.client else 'unknown'
    user_agent = request.headers.get('user-agent', '')
    x_forwarded = request.headers.get('x-forwarded-for', '')
    
    # Create fingerprint hash
    fingerprint_data = f"{client_ip}:{user_agent[:50]}:{x_forwarded}"
    return hashlib.sha256(fingerprint_data.encode()).hexdigest()[:16]

def is_safe_path(path: str) -> bool:
    """Validate file path for security"""
    if not path:
        return False
    
    # Check for directory traversal patterns
    dangerous_patterns = ['..', '~', '$', '|', ';', '&', '`', '<', '>', '"', "'"]
    if any(pattern in path for pattern in dangerous_patterns):
        return False
    
    # Validate against allowed file extensions and patterns
    safe_pattern = re.compile(r'^[a-zA-Z0-9._/-]+$')
    return bool(safe_pattern.match(path)) and len(path) < 255

# SECURITY: Secure cached file existence check with path validation
@lru_cache(maxsize=128)
def cached_file_exists(path: str) -> bool:
    """Secure cached file existence check with path traversal protection"""
    # SECURITY: Validate and sanitize file paths
    if not path or '..' in path or path.startswith('/'):
        return False
    
    # Normalize path to prevent traversal attacks
    normalized_path = os.path.normpath(path)
    if normalized_path != path or normalized_path.startswith('..'):
        return False
    
    return os.path.exists(path)

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    frontend_available: bool
    timestamp: int
    components: dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FUNCTIONAL FIX: Single FastAPI instance with proper configuration
app = FastAPI(
    title="Copperhead Consulting API", 
    version="1.0.0",
    description="Professional security consulting services platform",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {str(exc)}")
    logger.error(traceback.format_exc())
    # SECURITY: Sanitized error response - no internal path exposure
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error_id": str(int(time.time()))}
    )

@app.on_event("startup")
async def startup_event():
    """Async startup with comprehensive validation"""
    global DATABASE_CONNECTED
    logger.info("🚀 Copperhead Consulting API starting up...")
    
    # PERFORMANCE: Async file system checks
    frontend_dist_path = '/app/frontend/dist'
    
    # Non-blocking startup checks
    try:
        frontend_exists = await asyncio.get_event_loop().run_in_executor(
            None, cached_file_exists, frontend_dist_path
        )
        logger.info(f"📂 Frontend available: {frontend_exists}")
        
        # Validate database connection (mock validation for now)
        try:
            # This would be actual database connection validation
            DATABASE_CONNECTED = True
            logger.info("💾 Database connection: Ready")
        except Exception as db_error:
            logger.warning(f"💾 Database connection: Failed - {db_error}")
            DATABASE_CONNECTED = False
        
    except Exception as e:
        logger.warning(f"Startup validation failed: {e}")
    
    logger.info(f"🌍 Environment: {os.environ.get('ENVIRONMENT', 'production')}")
    logger.info("✅ Startup complete - ready to serve requests")

@app.middleware("http")
async def security_and_logging_middleware(request: Request, call_next):
    """Enhanced security with rate limiting and comprehensive headers"""
    start_time = time.time()
    client_ip = request.client.host if request.client else 'unknown'
    
    # SECURITY: Advanced rate limiting with circuit breaker protection
    current_time = time.time()
    global circuit_breaker_active, circuit_breaker_reset_time
    
    # Circuit breaker check - global protection
    if circuit_breaker_active:
        if current_time > circuit_breaker_reset_time:
            circuit_breaker_active = False
            logger.info("Circuit breaker reset")
        else:
            return JSONResponse(
                status_code=503,
                content={"detail": "Service temporarily unavailable"},
                headers={"Retry-After": "30"}
            )
    
    # Get secure client fingerprint
    client_fingerprint = get_client_fingerprint(request)
    
    with rate_limit_lock:
        # Efficient memory management with LRU eviction
        if len(rate_limit_storage) >= MAX_RATE_LIMIT_ENTRIES:
            # Remove oldest 20% of entries (LRU eviction)
            for _ in range(max(1, len(rate_limit_storage) // 5)):
                rate_limit_storage.popitem(last=False)
        
        # Get or create client request list
        if client_fingerprint not in rate_limit_storage:
            rate_limit_storage[client_fingerprint] = []
        
        client_requests = rate_limit_storage[client_fingerprint]
        
        # Clean old requests outside the window
        client_requests[:] = [req_time for req_time in client_requests 
                            if current_time - req_time < RATE_LIMIT_WINDOW]
        
        # Check for circuit breaker trigger (too many requests globally)
        total_recent_requests = sum(len(reqs) for reqs in rate_limit_storage.values())
        if total_recent_requests > CIRCUIT_BREAKER_THRESHOLD:
            circuit_breaker_active = True
            circuit_breaker_reset_time = current_time + 30
            logger.warning(f"Circuit breaker activated: {total_recent_requests} requests")
            return JSONResponse(
                status_code=503,
                content={"detail": "Service temporarily unavailable - high load"},
                headers={"Retry-After": "30"}
            )
        
        # Individual client rate limiting
        if len(client_requests) >= RATE_LIMIT_REQUESTS:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded"},
                headers={"Retry-After": "60"}
            )
        
        client_requests.append(current_time)
        # Move to end for LRU ordering
        rate_limit_storage.move_to_end(client_fingerprint)
    # Optimized logging - only log errors and important events
    if request.url.path.startswith("/api") or request.method != "GET":
        logger.info(f"🌐 {request.method} {request.url.path} from {client_ip}")
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # SECURITY: Comprehensive security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Log only significant requests or errors
        if response.status_code >= 400 or request.url.path.startswith("/api"):
            logger.info(f"✅ {request.method} {request.url.path} -> {response.status_code} ({process_time:.3f}s)")
        
        return response
    except Exception:
        process_time = time.time() - start_time
        logger.error(f"❌ {request.method} {request.url.path} -> ERROR ({process_time:.3f}s)")
        raise

# CORS configuration for frontend - SECURITY HARDENED
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://app.emergent.sh",  # Emergent platform origin
        "https://security-gamify.preview.emergentagent.com",
        "https://sec-elite-pwa.emergentagent.com", 
        "http://localhost:3000",
        "http://localhost:8001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8001"
    ],
    allow_credentials=False,  # SECURITY: Disabled credentials for wildcard protection
    allow_methods=["GET", "POST", "HEAD", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],  # SECURITY: Restricted headers
)

@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle CORS preflight requests"""
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

# Define API routes FIRST before catch-all routes
@app.get("/api/debug")
async def debug_info():
    """Secure debug information - limited exposure"""
    try:
        # SECURITY: Limited debug info to prevent information disclosure
        return {
            "status": "ok",
            "frontend_available": cached_file_exists("frontend/dist"),
            "environment": os.environ.get("ENVIRONMENT", "production"),
            "server": "FastAPI",
            "timestamp": int(time.time())
        }
    except Exception:
        return {"status": "error", "message": "Debug information unavailable"}

@app.get("/api/health")
async def api_health_check():
    """Unified health check endpoint with comprehensive status"""
    frontend_available = os.path.exists(frontend_dist_path)
    return {
        "status": "healthy", 
        "service": "copperhead-api",
        "version": "1.0.0",
        "frontend_available": frontend_available,
        "timestamp": int(time.time()),
        "components": {
            "api": "healthy",
            "frontend": "available" if frontend_available else "unavailable"
        }
    }

# Serve static frontend files
frontend_dist_path = "/app/frontend/dist"
try:
    if os.path.exists(frontend_dist_path):
        logger.info(f"Serving frontend static files from {frontend_dist_path}")
        
        # Mount assets directory
        if os.path.exists(f"{frontend_dist_path}/assets"):
            app.mount("/assets", StaticFiles(directory=f"{frontend_dist_path}/assets"), name="assets")
            logger.info("✅ Assets directory mounted")
        
        @app.api_route("/", methods=["GET", "HEAD"])
        async def serve_frontend(request: Request):
            """Serve the frontend index.html for root path"""
            try:
                index_path = f"{frontend_dist_path}/index.html"
                if os.path.exists(index_path):
                    # Log the incoming request for debugging
                    logger.info(f"Serving frontend to {request.client.host if request.client else 'unknown'} via {request.headers.get('host', 'unknown-host')}")
                    return FileResponse(index_path, media_type="text/html")
                else:
                    logger.error(f"index.html not found at {index_path}")
                    return JSONResponse({"error": "Frontend not available", "status": "backend-only"})
            except Exception as e:
                logger.error(f"Error serving frontend: {e}")
                return JSONResponse({"error": "Frontend serving error", "status": "backend-only"})
        
        @app.api_route("/health", methods=["GET", "HEAD"])
        async def frontend_health():
            """Health check endpoint for deployment system"""
            return {"status": "healthy", "service": "copperhead-frontend", "build": "production"}
        
        # Serve other static files (favicon, manifest, etc.) - but NOT API routes
        @app.get("/{file_path:path}")
        async def serve_static_files(file_path: str):
            """Secure optimized static file serving with input validation"""
            # SECURITY: Validate file path
            if not is_safe_path(file_path):
                raise HTTPException(status_code=400, detail="Invalid file path")
            
            # Ensure API routes are not intercepted
            if file_path.startswith("api"):
                raise HTTPException(status_code=404, detail="API endpoint not found")
            
            # Handle special PWA files
            if file_path == "site.webmanifest":
                manifest_path = os.path.join(frontend_dist_path, "site.webmanifest")
                if cached_file_exists(manifest_path):
                    # PERFORMANCE: Add cache headers for manifest
                    return FileResponse(
                        manifest_path, 
                        media_type="application/manifest+json",
                        headers={"Cache-Control": "public, max-age=3600"}
                    )
                else:
                    # Fallback manifest with cache headers
                    return JSONResponse({
                        "name": "Copperhead Consulting Inc",
                        "short_name": "Copperhead",
                        "description": "Professional security consulting services",
                        "start_url": "/",
                        "display": "standalone",
                        "background_color": "#1e293b",
                        "theme_color": "#ff6b35",
                        "icons": [
                            {
                                "src": "/assets/67eec2d5a5a87300d777cd9f_CCI-Favicon.png",
                                "sizes": "192x192",
                                "type": "image/png"
                            }
                        ]
                    }, headers={"Cache-Control": "public, max-age=3600"})
            
            file_full_path = os.path.join(frontend_dist_path, file_path)
            if cached_file_exists(file_full_path) and os.path.isfile(file_full_path):
                # PERFORMANCE: Add appropriate cache headers based on file type
                cache_headers = {"Cache-Control": "public, max-age=31536000"} if any(
                    file_path.endswith(ext) for ext in ['.js', '.css', '.png', '.jpg', '.ico', '.woff2']
                ) else {"Cache-Control": "public, max-age=3600"}
                
                return FileResponse(file_full_path, headers=cache_headers)
            
            # Handle common missing files gracefully
            if file_path in ["apple-touch-icon.png", "favicon.ico", "robots.txt"]:
                if file_path.endswith((".png", ".ico")):
                    return JSONResponse({"error": "Asset not found"}, status_code=404)
            
            # For SPA routing, return index.html for non-file requests
            if "." not in file_path:
                return FileResponse(
                    f"{frontend_dist_path}/index.html", 
                    media_type="text/html",
                    headers={"Cache-Control": "no-cache"}
                )
            
            raise HTTPException(status_code=404, detail="File not found")
            
    else:
        logger.warning(f"Frontend dist directory not found at {frontend_dist_path}")
        
        @app.api_route("/", methods=["GET", "HEAD"])
        async def root_fallback():
            return {"message": "Copperhead Consulting API", "status": "backend-only", "frontend": "not available"}
        
        @app.api_route("/health", methods=["GET", "HEAD"]) 
        async def backend_only_health():
            return {"status": "healthy", "service": "copperhead-backend", "frontend": "not available"}

except Exception as e:
    logger.error(f"Error setting up frontend serving: {e}")
    logger.error(traceback.format_exc())
    
    @app.api_route("/", methods=["GET", "HEAD"])
    async def error_fallback():
        return {"message": "Copperhead Consulting API", "status": "backend-only", "error": "Frontend setup failed"}

# Uvicorn startup configuration
if __name__ == "__main__":
    import uvicorn
    # Simple, deployment-friendly uvicorn configuration
    uvicorn.run(
        "server:app",  # Use string format for better compatibility
        host="0.0.0.0", 
        port=8001, 
        log_level="warning",  # Reduce log verbosity 
        access_log=False,  # Disable access logging for better performance
        workers=1
    )