from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import os
import logging
import traceback
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Copperhead Consulting API", version="1.0.0")

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

app = FastAPI(title="Copperhead Consulting API", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    logger.info("🚀 Copperhead Consulting API starting up...")
    logger.info(f"📁 Frontend dist path: {'/app/frontend/dist'}")
    logger.info(f"📂 Frontend dist exists: {os.path.exists('/app/frontend/dist')}")
    logger.info(f"🌍 Environment: {os.environ.get('ENVIRONMENT', 'unknown')}")
    logger.info(f"🔧 Python version: {os.sys.version}")
    logger.info("✅ Startup complete - ready to serve requests")
    if os.path.exists('/app/frontend/dist'):
        files = os.listdir('/app/frontend/dist')
        logger.info(f"📋 Frontend dist files: {files[:10]}")  # Log first 10 files

@app.middleware("http")
async def security_and_logging_middleware(request: Request, call_next):
    """Enhanced security headers and request logging"""
    start_time = time.time()
    logger.info(f"🌐 {request.method} {request.url.path} from {request.client.host if request.client else 'unknown'}")
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # SECURITY: Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        
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
    """Debug information for troubleshooting"""
    try:
        return {
            "status": "ok",
            "frontend_dist_exists": os.path.exists(frontend_dist_path),
            "frontend_files_count": len(os.listdir(frontend_dist_path)) if os.path.exists(frontend_dist_path) else 0,
            "environment": os.environ.get("ENVIRONMENT", "unknown"),
            "python_version": "3.11+",
            "server": "FastAPI + Uvicorn",
            "process_id": os.getpid(),
            "working_directory": os.getcwd()
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/health")
async def api_health_check():
    """API health check endpoint"""
    return {"status": "healthy", "service": "copperhead-api"}

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
            """Serve static files from frontend dist"""
            # Ensure API routes are not intercepted
            if file_path.startswith("api"):
                raise HTTPException(status_code=404, detail="API endpoint not found")
            
            # Handle special PWA files
            if file_path == "site.webmanifest":
                manifest_path = os.path.join(frontend_dist_path, "site.webmanifest")
                if os.path.exists(manifest_path):
                    return FileResponse(manifest_path, media_type="application/manifest+json")
                else:
                    # Fallback manifest if file doesn't exist
                    logger.info("Serving fallback PWA manifest")
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
                    })
            
            file_full_path = os.path.join(frontend_dist_path, file_path)
            if os.path.exists(file_full_path) and os.path.isfile(file_full_path):
                return FileResponse(file_full_path)
            
            # Handle common missing files gracefully
            if file_path in ["apple-touch-icon.png", "favicon.ico", "robots.txt"]:
                logger.info(f"Serving placeholder for missing file: {file_path}")
                # Return a 1x1 transparent PNG for missing icons
                if file_path.endswith(".png") or file_path.endswith(".ico"):
                    return JSONResponse({"error": "Asset not found"}, status_code=404)
            
            # For SPA routing, return index.html for non-file requests
            if "." not in file_path:
                return FileResponse(f"{frontend_dist_path}/index.html", media_type="text/html")
            
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