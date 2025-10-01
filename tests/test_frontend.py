"""Frontend smoke tests"""
import os

def test_frontend_built():
    """Test that frontend is built"""
    dist_path = "/app/frontend/dist"
    assert os.path.exists(dist_path), "Frontend dist directory missing"
    assert os.path.isdir(dist_path), "Frontend dist is not a directory"
    
def test_index_html_exists():
    """Test that index.html exists in build"""
    index_path = "/app/frontend/dist/index.html"
    assert os.path.exists(index_path), "index.html missing from build"
    
def test_assets_exist():
    """Test that JS/CSS assets were built"""
    assets_path = "/app/frontend/dist/assets"
    assert os.path.exists(assets_path), "Assets directory missing"
    assert os.path.isdir(assets_path), "Assets is not a directory"
    
    # Check for at least some JS files
    js_files = [f for f in os.listdir(assets_path) if f.endswith('.js')]
    assert len(js_files) > 0, "No JavaScript files in assets"

if __name__ == "__main__":
    print("Running frontend smoke tests...")
    test_frontend_built()
    print("✅ Frontend dist exists")
    test_index_html_exists()
    print("✅ index.html present")
    test_assets_exist()
    print("✅ Assets built")
    print("\n🎉 All frontend smoke tests passed!")
