"""
Copperhead Consulting Inc - Main Application Entry Point
This file helps Emergent deployment system detect the project as a Python application.
The actual server implementation is in backend/server.py
"""

# Import the actual FastAPI app from backend
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import the app
from server import app

# This allows running via: uvicorn app:app
__all__ = ['app']