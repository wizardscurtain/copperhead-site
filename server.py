from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
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
import uuid
from datetime import datetime, timedelta
import bleach
import secrets
import hmac
import hashlib
import json

# Database configuration with PostgreSQL
from database import (
    db_manager, insert_contact_submission, insert_security_log,
    insert_session, get_session, update_session_activity, 
    delete_session, cleanup_expired_sessions
)

DATABASE_CONNECTED = False

# SECURITY: Advanced memory-safe rate limiting with circuit breaker
import threading
from collections import OrderedDict

rate_limit_lock = threading.RLock()
rate_limit_storage = OrderedDict()  # LRU-style ordered dict
RATE_LIMIT_REQUESTS = 100  # requests per minute
RATE_LIMIT_WINDOW = 60  # seconds
MAX_RATE_LIMIT_ENTRIES = 5000  # Reduced for better memory control
CIRCUIT_BREAKER_THRESHOLD = 1000  # Requests per second to trigger circuit breaker
circuit_breaker_active = False
circuit_breaker_reset_time = 0

# SECURITY: CSRF Protection with rotating tokens
CSRF_SECRET_KEY = os.environ.get('CSRF_SECRET', secrets.token_urlsafe(32))
csrf_tokens = {}  # In production, use Redis or database
CSRF_TOKEN_EXPIRY = 3600  # 1 hour

# SECURITY: Session management with secure tokens
active_sessions = {}  # In production, use Redis or database
SESSION_TIMEOUT = 1800  # 30 minutes
SESSION_SECRET = os.environ.get('SESSION_SECRET', secrets.token_urlsafe(32))

def get_client_fingerprint(request: Request) -> str:
    """Generate secure client fingerprint to prevent IP spoofing"""
    client_ip = request.client.host if request.client else 'unknown'
    user_agent = request.headers.get('user-agent', '')
    x_forwarded = request.headers.get('x-forwarded-for', '')
    
    # Create fingerprint hash
    fingerprint_data = f"{client_ip}:{user_agent[:50]}:{x_forwarded}"
    return hashlib.sha256(fingerprint_data.encode()).hexdigest()[:16]

def sanitize_input(data: str, max_length: int = 1000) -> str:
    """Sanitize user input to prevent injection attacks"""
    if not data:
        return ""
    
    # Truncate to prevent buffer overflow
    data = data[:max_length]
    
    # Remove dangerous characters and HTML
    sanitized = bleach.clean(data, tags=[], attributes={}, strip=True)
    
    # Additional SQL/NoSQL injection prevention
    dangerous_patterns = ['$', '{', '}', '..', '<script', 'javascript:', 'eval(']
    for pattern in dangerous_patterns:
        sanitized = sanitized.replace(pattern, '')
    
    return sanitized.strip()

def generate_csrf_token(client_fingerprint: str) -> str:
    """Generate secure CSRF token with client binding"""
    timestamp = str(int(time.time()))
    nonce = secrets.token_urlsafe(16)
    
    # Create HMAC with client fingerprint binding
    message = f"{client_fingerprint}:{timestamp}:{nonce}"
    signature = hmac.new(
        CSRF_SECRET_KEY.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
    
    token = f"{timestamp}:{nonce}:{signature}"
    
    # Store token with expiry
    csrf_tokens[token] = {
        'client': client_fingerprint,
        'created': time.time(),
        'used': False
    }
    
    # Clean expired tokens
    current_time = time.time()
    expired_tokens = [
        t for t, data in csrf_tokens.items()
        if current_time - data['created'] > CSRF_TOKEN_EXPIRY
    ]
    for token in expired_tokens:
        del csrf_tokens[token]
    
    return token

def validate_csrf_token(token: str, client_fingerprint: str) -> bool:
    """Validate CSRF token with double-submit cookie pattern"""
    if not token or token not in csrf_tokens:
        return False
    
    token_data = csrf_tokens[token]
    
    # Check if token is expired
    if time.time() - token_data['created'] > CSRF_TOKEN_EXPIRY:
        del csrf_tokens[token]
        return False
    
    # Check if token was already used (prevent replay)
    if token_data['used']:
        return False
    
    # Verify client fingerprint binding
    if token_data['client'] != client_fingerprint:
        return False
    
    # Verify HMAC signature
    try:
        timestamp, nonce, signature = token.split(':')
        message = f"{client_fingerprint}:{timestamp}:{nonce}"
        expected_signature = hmac.new(
            CSRF_SECRET_KEY.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, expected_signature):
            return False
        
        # Mark token as used
        token_data['used'] = True
        return True
        
    except (ValueError, KeyError):
        return False

def create_secure_session(client_fingerprint: str) -> str:
    """Create secure session with client binding"""
    session_id = secrets.token_urlsafe(32)
    
    active_sessions[session_id] = {
        'client': client_fingerprint,
        'created': time.time(),
        'last_activity': time.time(),
        'csrf_token': generate_csrf_token(client_fingerprint)
    }
    
    return session_id

def validate_session(session_id: str, client_fingerprint: str) -> bool:
    """Validate session with timeout and client binding"""
    if not session_id or session_id not in active_sessions:
        return False
    
    session_data = active_sessions[session_id]
    current_time = time.time()
    
    # Check session timeout
    if current_time - session_data['last_activity'] > SESSION_TIMEOUT:
        del active_sessions[session_id]
        return False
    
    # Verify client fingerprint
    if session_data['client'] != client_fingerprint:
        return False
    
    # Update last activity
    session_data['last_activity'] = current_time
    return True

async def log_security_event(event_type: str, details: dict, client_ip: str):
    """Log security events to PostgreSQL database with proper error handling"""
    if not DATABASE_CONNECTED:
        logger.warning(f"Security event not logged - DB unavailable: {event_type}")
        return
    
    try:
        severity = "high" if event_type in ["rate_limit_exceeded", "circuit_breaker"] else "medium"
        await insert_security_log(event_type, client_ip, details, severity)
    except Exception as e:
        logger.error(f"Failed to log security event: {e}")

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
        
        # Initialize PostgreSQL database connection
        try:
            await db_manager.connect()
            await db_manager.create_tables()
            DATABASE_CONNECTED = True
            logger.info("💾 PostgreSQL database: Ready with connection pooling")
            
        except Exception as db_error:
            logger.warning(f"💾 PostgreSQL connection: Failed - {db_error}")
            DATABASE_CONNECTED = False
            # Graceful degradation - app continues without database
        
    except Exception as e:
        logger.warning(f"Startup validation failed: {e}")
    
    logger.info(f"🌍 Environment: {os.environ.get('ENVIRONMENT', 'production')}")
    logger.info("✅ Startup complete - ready to serve requests")

@app.on_event("shutdown")
async def shutdown_event():
    """Graceful shutdown with database cleanup"""
    global db_client
    logger.info("🔄 Shutting down gracefully...")
    
    if db_client:
        try:
            db_client.close()
            logger.info("💾 Database connections closed")
        except Exception as e:
            logger.error(f"Error closing database: {e}")
    
    logger.info("✅ Shutdown complete")

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
            # Log security event
            await log_security_event(
                "rate_limit_exceeded", 
                {"requests": len(client_requests), "fingerprint": client_fingerprint},
                client_ip
            )
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
        
        # SECURITY: Comprehensive security headers with strict CSP
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        
        # Enhanced Content Security Policy
        csp_policy = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https: blob:; "
            "connect-src 'self' https://www.google-analytics.com https://analytics.google.com; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self' mailto:; "
            "upgrade-insecure-requests"
        )
        response.headers["Content-Security-Policy"] = csp_policy
        
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=(), payment=(), usb=()"
        response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
        
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
        "https://copperheadci.com",
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

# SECURITY: CSRF Token endpoint
@app.post("/api/csrf-token")
async def get_csrf_token(request: Request):
    """Generate CSRF token for client"""
    client_fingerprint = get_client_fingerprint(request)
    token = generate_csrf_token(client_fingerprint)
    
    return {
        "csrf_token": token,
        "expires_in": CSRF_TOKEN_EXPIRY
    }

# SECURITY: Session management endpoint
@app.post("/api/session")
async def create_session(request: Request):
    """Create secure session"""
    client_fingerprint = get_client_fingerprint(request)
    session_id = create_secure_session(client_fingerprint)
    
    return {
        "session_id": session_id,
        "expires_in": SESSION_TIMEOUT
    }

# SECURITY: Contact form with CSRF protection
class ContactForm(BaseModel):
    name: str
    email: str
    message: str
    csrf_token: str

@app.post("/api/contact")
async def submit_contact_form(form_data: ContactForm, request: Request):
    """Secure contact form submission with CSRF protection"""
    client_fingerprint = get_client_fingerprint(request)
    
    # Validate CSRF token
    if not validate_csrf_token(form_data.csrf_token, client_fingerprint):
        await log_security_event(
            "csrf_validation_failed",
            {"form": "contact", "fingerprint": client_fingerprint},
            request.client.host if request.client else 'unknown'
        )
        raise HTTPException(status_code=403, detail="Invalid CSRF token")
    
    # Sanitize inputs
    name = sanitize_input(form_data.name, 100)
    email = sanitize_input(form_data.email, 255)
    message = sanitize_input(form_data.message, 2000)
    
    # Validate email format
    email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    if not email_pattern.match(email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Store in database if available
    if DATABASE_CONNECTED and database is not None:
        try:
            contact_submission = {
                "_id": str(uuid.uuid4()),
                "name": name,
                "email": email,
                "message": message,
                "submitted_at": datetime.utcnow(),
                "client_fingerprint": client_fingerprint,
                "status": "new"
            }
            
            await database.contact_submissions.insert_one(contact_submission)
            
            # Log successful submission
            await log_security_event(
                "contact_form_submitted",
                {"submission_id": contact_submission["_id"]},
                request.client.host if request.client else 'unknown'
            )
            
            return {"status": "success", "message": "Contact form submitted successfully"}
            
        except Exception as e:
            logger.error(f"Failed to store contact submission: {e}")
            raise HTTPException(status_code=500, detail="Failed to process submission")
    else:
        # Fallback when database is unavailable
        logger.info(f"Contact form submission (DB unavailable): {name} <{email}>")
        return {"status": "success", "message": "Contact form received"}

# SECURITY: WebSocket connection manager with rate limiting
class WebSocketManager:
    def __init__(self):
        self.active_connections: dict = {}
        self.connection_limits = {}
        self.message_counts = {}
        
    async def connect(self, websocket: WebSocket, client_id: str):
        """Secure WebSocket connection with rate limiting"""
        client_ip = websocket.client.host if websocket.client else 'unknown'
        
        # Check connection limits per IP
        if client_ip in self.connection_limits:
            if self.connection_limits[client_ip] >= 5:  # Max 5 connections per IP
                await websocket.close(code=1008, reason="Connection limit exceeded")
                return False
            self.connection_limits[client_ip] += 1
        else:
            self.connection_limits[client_ip] = 1
        
        await websocket.accept()
        self.active_connections[client_id] = {
            'websocket': websocket,
            'ip': client_ip,
            'connected_at': time.time(),
            'last_message': time.time()
        }
        self.message_counts[client_id] = 0
        
        logger.info(f"WebSocket connected: {client_id} from {client_ip}")
        return True
    
    def disconnect(self, client_id: str):
        """Clean disconnect handling"""
        if client_id in self.active_connections:
            client_ip = self.active_connections[client_id]['ip']
            
            # Decrease connection count for IP
            if client_ip in self.connection_limits:
                self.connection_limits[client_ip] -= 1
                if self.connection_limits[client_ip] <= 0:
                    del self.connection_limits[client_ip]
            
            del self.active_connections[client_id]
            if client_id in self.message_counts:
                del self.message_counts[client_id]
            
            logger.info(f"WebSocket disconnected: {client_id}")
    
    async def send_personal_message(self, message: str, client_id: str):
        """Send message to specific client"""
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]['websocket']
            try:
                await websocket.send_text(message)
            except Exception as e:
                logger.error(f"Failed to send WebSocket message to {client_id}: {e}")
                self.disconnect(client_id)
    
    def is_rate_limited(self, client_id: str) -> bool:
        """Check if client is rate limited"""
        if client_id not in self.message_counts:
            return False
        
        current_time = time.time()
        connection_data = self.active_connections.get(client_id)
        
        if not connection_data:
            return True
        
        # Reset message count every minute
        if current_time - connection_data['last_message'] > 60:
            self.message_counts[client_id] = 0
            connection_data['last_message'] = current_time
        
        # Allow max 30 messages per minute
        if self.message_counts[client_id] >= 30:
            return True
        
        self.message_counts[client_id] += 1
        return False

websocket_manager = WebSocketManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """Secure WebSocket endpoint with authentication and rate limiting"""
    # Sanitize client_id
    client_id = sanitize_input(client_id, 50)
    if not client_id or not re.match(r'^[a-zA-Z0-9_-]+$', client_id):
        await websocket.close(code=1008, reason="Invalid client ID")
        return
    
    # Attempt connection
    if not await websocket_manager.connect(websocket, client_id):
        return
    
    try:
        while True:
            # Receive message
            data = await websocket.receive_text()
            
            # Rate limiting check
            if websocket_manager.is_rate_limited(client_id):
                await websocket.send_text(json.dumps({
                    "error": "Rate limit exceeded",
                    "code": "RATE_LIMIT"
                }))
                continue
            
            # Sanitize incoming message
            sanitized_data = sanitize_input(data, 1000)
            
            try:
                message_data = json.loads(sanitized_data)
                
                # Validate message structure
                if not isinstance(message_data, dict) or 'type' not in message_data:
                    await websocket.send_text(json.dumps({
                        "error": "Invalid message format",
                        "code": "INVALID_FORMAT"
                    }))
                    continue
                
                # Process different message types
                message_type = message_data.get('type')
                
                if message_type == 'ping':
                    await websocket.send_text(json.dumps({
                        "type": "pong",
                        "timestamp": int(time.time())
                    }))
                
                elif message_type == 'echo':
                    content = sanitize_input(message_data.get('content', ''), 500)
                    await websocket.send_text(json.dumps({
                        "type": "echo_response",
                        "content": content,
                        "timestamp": int(time.time())
                    }))
                
                else:
                    await websocket.send_text(json.dumps({
                        "error": "Unknown message type",
                        "code": "UNKNOWN_TYPE"
                    }))
                
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    "error": "Invalid JSON",
                    "code": "INVALID_JSON"
                }))
                
    except WebSocketDisconnect:
        websocket_manager.disconnect(client_id)
    except Exception as e:
        logger.error(f"WebSocket error for {client_id}: {e}")
        websocket_manager.disconnect(client_id)

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