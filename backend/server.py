from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, EmailStr
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Copperhead Consulting API", version="1.0.0")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {str(exc)}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "path": str(request.url)}
    )

app = FastAPI(title="Copperhead Consulting API", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    logger.info("🚀 Copperhead Consulting API starting up...")
    logger.info(f"📁 Frontend dist path: {'/app/frontend/dist'}")
    logger.info(f"📂 Frontend dist exists: {os.path.exists('/app/frontend/dist')}")
    if os.path.exists('/app/frontend/dist'):
        files = os.listdir('/app/frontend/dist')
        logger.info(f"📋 Frontend dist files: {files[:10]}")  # Log first 10 files

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        async def serve_frontend():
            """Serve the frontend index.html for root path"""
            try:
                index_path = f"{frontend_dist_path}/index.html"
                if os.path.exists(index_path):
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
        
        # Serve other static files (favicon, manifest, etc.)
        @app.get("/{file_path:path}")
        async def serve_static_files(file_path: str):
            """Serve static files from frontend dist"""
            if file_path.startswith("api/"):
                raise HTTPException(status_code=404, detail="API endpoint not found")
            
            file_full_path = os.path.join(frontend_dist_path, file_path)
            if os.path.exists(file_full_path) and os.path.isfile(file_full_path):
                return FileResponse(file_full_path)
            
            # For SPA routing, return index.html for non-file requests
            if "." not in file_path and not file_path.startswith("api"):
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
        return {"message": "Copperhead Consulting API", "status": "backend-only", "error": str(e)}

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

# Email configuration
RESEND_API_KEY = os.getenv('RESEND_API_KEY')
DESTINATION_EMAIL = "contact@copperheadci.com"

class ContactFormData(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    company: str = ""
    service: str
    message: str
    urgency: str = "standard"
    consent: bool

class QuoteRequestData(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    company: str = ""
    services: list[str]
    message: str
    urgency: str = "standard"
    timeline: str = ""
    budget: str = ""
    consent: bool

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "copperhead-api"}

@app.post("/api/send-email")
async def send_contact_email(form_data: ContactFormData):
    try:
        if not form_data.consent:
            raise HTTPException(status_code=400, detail="Consent required")
        
        # Prepare email content
        subject = f"Contact Form: {form_data.service} - {form_data.urgency.upper()}"
        
        html_content = f"""
        <html>
        <body>
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> {form_data.name}</p>
            <p><strong>Email:</strong> {form_data.email}</p>
            <p><strong>Phone:</strong> {form_data.phone or 'Not provided'}</p>
            <p><strong>Company:</strong> {form_data.company or 'Not provided'}</p>
            <p><strong>Service:</strong> {form_data.service}</p>
            <p><strong>Urgency:</strong> {form_data.urgency}</p>
            <p><strong>Message:</strong><br>{form_data.message}</p>
        </body>
        </html>
        """
        
        # Send email using Resend or fallback method
        await send_email_via_resend(subject, html_content, form_data.email)
        
        return {"success": True, "message": "Email sent successfully"}
        
    except Exception as e:
        logger.error(f"Email sending failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@app.post("/api/quote-request")
async def send_quote_request(quote_data: QuoteRequestData):
    try:
        if not quote_data.consent:
            raise HTTPException(status_code=400, detail="Consent required")
        
        # Prepare email content
        subject = f"Quote Request: {', '.join(quote_data.services[:2])} - {quote_data.urgency.upper()}"
        
        html_content = f"""
        <html>
        <body>
            <h2>New Quote Request</h2>
            <p><strong>Name:</strong> {quote_data.name}</p>
            <p><strong>Email:</strong> {quote_data.email}</p>
            <p><strong>Phone:</strong> {quote_data.phone or 'Not provided'}</p>
            <p><strong>Company:</strong> {quote_data.company or 'Not provided'}</p>
            <p><strong>Services:</strong> {', '.join(quote_data.services)}</p>
            <p><strong>Timeline:</strong> {quote_data.timeline or 'Not specified'}</p>
            <p><strong>Budget:</strong> {quote_data.budget or 'Not specified'}</p>
            <p><strong>Urgency:</strong> {quote_data.urgency}</p>
            <p><strong>Message:</strong><br>{quote_data.message}</p>
        </body>
        </html>
        """
        
        # Send email
        await send_email_via_resend(subject, html_content, quote_data.email)
        
        return {"success": True, "message": "Quote request sent successfully"}
        
    except Exception as e:
        logger.error(f"Quote request sending failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send quote request")

async def send_email_via_resend(subject: str, html_content: str, reply_to: str):
    """Send email using Resend API with fallback for missing API key"""
    import requests
    
    if not RESEND_API_KEY or RESEND_API_KEY == "your_resend_api_key_here":
        # For deployment testing - log email instead of failing
        logger.info(f"EMAIL WOULD BE SENT - Subject: {subject}, Reply-to: {reply_to}")
        logger.info(f"EMAIL CONTENT: {html_content[:200]}...")
        return {"message": "Email logged (API key not configured)", "id": "test-email-id"}
    
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "from": "contact@copperheadci.com",  # Configure this in Resend
        "to": [DESTINATION_EMAIL],
        "reply_to": reply_to,
        "subject": subject,
        "html": html_content
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to send email via Resend")
    
    return response.json()

if __name__ == "__main__":
    import uvicorn
    # Comprehensive uvicorn configuration for deployment
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8001, 
        log_level="info",
        access_log=True,
        loop="asyncio",
        workers=1  # Single worker for deployment stability
    )