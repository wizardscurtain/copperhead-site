#!/usr/bin/env python3
"""
Render Deployment Verification Script
Verifies all components are ready for production deployment
"""

import os
import sys
import json
import subprocess
from pathlib import Path

def check_file_exists(file_path, description):
    """Check if a file exists and report status"""
    if os.path.exists(file_path):
        print(f"✅ {description}: EXISTS")
        return True
    else:
        print(f"❌ {description}: MISSING")
        return False

def check_directory_structure():
    """Verify directory structure is correct"""
    print("🔍 Checking Directory Structure...")
    
    required_dirs = [
        ('frontend/public/videos', 'Video assets directory'),
        ('frontend/dist', 'Frontend build directory'),
        ('alembic/versions', 'Database migration directory')
    ]
    
    all_good = True
    for dir_path, description in required_dirs:
        if os.path.exists(dir_path):
            print(f"✅ {description}: EXISTS")
        else:
            print(f"❌ {description}: MISSING")
            all_good = False
    
    return all_good

def check_configuration_files():
    """Verify all configuration files are present"""
    print("\n🔍 Checking Configuration Files...")
    
    config_files = [
        ('render.yaml', 'Render Blueprint'),
        ('Dockerfile', 'Docker configuration'),
        ('requirements.txt', 'Python dependencies'),
        ('frontend/package.json', 'Frontend dependencies'),
        ('alembic.ini', 'Database migration config'),
        ('frontend/public/_redirects', 'Render redirects'),
        ('frontend/public/_headers', 'Render headers')
    ]
    
    all_good = True
    for file_path, description in config_files:
        if not check_file_exists(file_path, description):
            all_good = False
    
    return all_good

def check_environment_variables():
    """Check environment variable configuration"""
    print("\n🔍 Checking Environment Variables...")
    
    # Check backend .env
    backend_env = 'backend/.env'
    if os.path.exists(backend_env):
        with open(backend_env, 'r') as f:
            content = f.read()
            if 'DATABASE_URL' in content:
                print("✅ Backend DATABASE_URL: CONFIGURED")
            else:
                print("❌ Backend DATABASE_URL: MISSING")
                return False
    
    # Check frontend .env
    frontend_env = 'frontend/.env'
    if os.path.exists(frontend_env):
        with open(frontend_env, 'r') as f:
            content = f.read()
            if 'VITE_BACKEND_URL' in content:
                print("✅ Frontend VITE_BACKEND_URL: CONFIGURED")
            else:
                print("❌ Frontend VITE_BACKEND_URL: MISSING")
                return False
    
    return True

def check_database_migration():
    """Verify database migration files"""
    print("\n🔍 Checking Database Migration...")
    
    migration_file = 'alembic/versions/001_initial_postgresql_migration.py'
    if check_file_exists(migration_file, 'Initial PostgreSQL migration'):
        # Check if migration contains required tables
        with open(migration_file, 'r') as f:
            content = f.read()
            required_tables = ['contact_submissions', 'security_logs', 'sessions']
            
            for table in required_tables:
                if table in content:
                    print(f"✅ Migration includes {table} table")
                else:
                    print(f"❌ Migration missing {table} table")
                    return False
        return True
    
    return False

def check_video_assets():
    """Check video assets are properly configured"""
    print("\n🔍 Checking Video Assets...")
    
    video_dir = 'frontend/public/videos'
    if os.path.exists(video_dir):
        video_files = os.listdir(video_dir)
        
        # Check for video files
        has_mp4 = any(f.endswith('.mp4') for f in video_files)
        has_webm = any(f.endswith('.webm') for f in video_files)
        
        if has_mp4:
            print("✅ MP4 video file: FOUND")
        else:
            print("⚠️  MP4 video file: NOT FOUND (will use placeholder)")
        
        if has_webm:
            print("✅ WebM video file: FOUND")
        else:
            print("⚠️  WebM video file: NOT FOUND (MP4 fallback will be used)")
        
        return True
    else:
        print("❌ Video directory: NOT FOUND")
        return False

def check_frontend_build():
    """Verify frontend build is successful"""
    print("\n🔍 Checking Frontend Build...")
    
    dist_dir = 'frontend/dist'
    if os.path.exists(dist_dir):
        dist_files = os.listdir(dist_dir)
        
        # Check for essential build files
        has_index = 'index.html' in dist_files
        has_assets = any(f.startswith('assets') for f in dist_files)
        
        if has_index:
            print("✅ index.html: FOUND")
        else:
            print("❌ index.html: MISSING")
            return False
        
        if has_assets:
            print("✅ Assets directory: FOUND")
        else:
            print("❌ Assets directory: MISSING")
            return False
        
        return True
    else:
        print("❌ Frontend dist directory: NOT FOUND")
        print("   Run 'cd frontend && yarn build' to create build")
        return False

def check_python_imports():
    """Test Python imports work correctly"""
    print("\n🔍 Checking Python Imports...")
    
    try:
        # Test database import
        import database
        print("✅ Database module: IMPORTS OK")
        
        # Test server import
        import server
        print("✅ Server module: IMPORTS OK")
        
        return True
    except ImportError as e:
        print(f"❌ Python import error: {e}")
        return False

def generate_deployment_report():
    """Generate final deployment readiness report"""
    print("\n" + "="*60)
    print("🚀 RENDER DEPLOYMENT READINESS REPORT")
    print("="*60)
    
    checks = [
        (check_directory_structure, "Directory Structure"),
        (check_configuration_files, "Configuration Files"),
        (check_environment_variables, "Environment Variables"),
        (check_database_migration, "Database Migration"),
        (check_video_assets, "Video Assets"),
        (check_frontend_build, "Frontend Build"),
        (check_python_imports, "Python Imports")
    ]
    
    passed_checks = 0
    total_checks = len(checks)
    
    for check_func, check_name in checks:
        try:
            if check_func():
                passed_checks += 1
        except Exception as e:
            print(f"❌ {check_name}: ERROR - {e}")
    
    print("\n" + "="*60)
    print(f"📊 RESULTS: {passed_checks}/{total_checks} checks passed")
    
    if passed_checks == total_checks:
        print("\n🎉 DEPLOYMENT READY!")
        print("✅ All checks passed - ready for Render deployment")
        print("\n📋 Next Steps:")
        print("1. Push code to Git repository")
        print("2. Create Render services using render.yaml")
        print("3. Configure environment variables")
        print("4. Deploy and test")
        return True
    else:
        print("\n⚠️  DEPLOYMENT NOT READY")
        print(f"❌ {total_checks - passed_checks} checks failed")
        print("\n🔧 Fix the issues above before deploying")
        return False

def main():
    print("🔍 Render Deployment Verification")
    print("Checking migration completeness and deployment readiness...\n")
    
    # Change to app directory
    os.chdir('/app')
    
    # Run verification
    ready = generate_deployment_report()
    
    # Exit with appropriate code
    sys.exit(0 if ready else 1)

if __name__ == "__main__":
    main()
