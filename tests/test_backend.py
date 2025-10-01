"""Backend smoke tests"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_imports():
    """Test that critical imports work"""
    from app import app
    assert app is not None
    
def test_fastapi_instance():
    """Test that app is a FastAPI instance"""
    from app import app
    from fastapi import FastAPI
    assert isinstance(app, FastAPI)
    
def test_health_endpoint_exists():
    """Test that health endpoint is registered"""
    from app import app
    routes = [route.path for route in app.routes]
    assert '/api/health' in routes
    
def test_app_has_routes():
    """Test that app has routes configured"""
    from app import app
    assert len(app.routes) > 0

if __name__ == "__main__":
    print("Running backend smoke tests...")
    test_imports()
    print("✅ Imports work")
    test_fastapi_instance()
    print("✅ FastAPI instance correct")
    test_health_endpoint_exists()
    print("✅ Health endpoint exists")
    test_app_has_routes()
    print("✅ Routes configured")
    print("\n🎉 All backend smoke tests passed!")
