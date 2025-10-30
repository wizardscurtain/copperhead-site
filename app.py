"""
Copperhead Consulting Inc - Main Application Entry Point
Production-ready FastAPI application.
"""

# Import the FastAPI app from server.py (root level)
from server import app

# This allows running via: uvicorn app:app
__all__ = ['app']