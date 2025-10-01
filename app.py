"""
Copperhead Consulting Inc - Main Application Entry Point
Compatible with Emergent auto-deployment system.
"""

# Import the FastAPI app from server.py (root level)
from server import app

# This allows running via: uvicorn app:app
__all__ = ['app']