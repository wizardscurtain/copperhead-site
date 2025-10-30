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

# Database configuration (MongoDB ready)
DATABASE_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/copperhead_db')
DATABASE_CONNECTED = False

# SECURITY: Rate limiting storage
rate_limit_storage = defaultdict(list)
RATE_LIMIT_REQUESTS = 100  # requests per minute
RATE_LIMIT_WINDOW = 60  # seconds

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
    """Async startup with performance optimizations"""
    logger.info("🚀 Copperhead Consulting API starting up...")
    
    # PERFORMANCE: Async file system checks
    frontend_dist_path = '/app/frontend/dist'
    logger.info(f"📁 Frontend dist path: {frontend_dist_path}")
    
    # Non-blocking startup checks
    try:
        frontend_exists = await asyncio.get_event_loop().run_in_executor(
            None, cached_file_exists, frontend_dist_path
        )
        logger.info(f"📂 Frontend dist exists: {frontend_exists}")
        
        if frontend_exists:
            # Async file listing
            files = await asyncio.get_event_loop().run_in_executor(
                None, lambda: os.listdir(frontend_dist_path)[:10]
            )
            logger.info(f"📋 Frontend dist files: {files}")
    except Exception as e:
        logger.warning(f"Startup file check failed: {e}")
    
    logger.info(f"🌍 Environment: {os.environ.get('ENVIRONMENT', 'unknown')}")
    logger.info("✅ Startup complete - ready to serve requests")

@app.middleware("http")
async def security_and_logging_middleware(request: Request, call_next):
    """Enhanced security with rate limiting and comprehensive headers"""
    start_time = time.time()
    client_ip = request.client.host if request.client else 'unknown'
    
    # SECURITY: Rate limiting
    current_time = time.time()
    client_requests = rate_limit_storage[client_ip]
    
    # Clean old requests outside the window
    client_requests[:] = [req_time for req_time in client_requests if current_time - req_time < RATE_LIMIT_WINDOW]
    
    if len(client_requests) >= RATE_LIMIT_REQUESTS:
        logger.warning(f"Rate limit exceeded for {client_ip}")
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded"},
            headers={"Retry-After": "60"}
        )
    
    client_requests.append(current_time)
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
        
        logger.info(f"✅ {request.method} {request.url.path} -> {response.status_code} ({process_time:.3f}s)")
        return response
    except Exception as e:
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
    except Exception as e:
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
            """Optimized static file serving with caching"""
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