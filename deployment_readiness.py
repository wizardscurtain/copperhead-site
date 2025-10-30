#!/usr/bin/env python3
"""
Deployment Readiness Validator for Copperhead Consulting Application
Comprehensive production environment validation
"""

import os
import subprocess
import json
import sys
from pathlib import Path

def check_environment_variables():
    """Validate required environment variables"""
    required_vars = {
        'backend': {
            'MONGO_URL': '/app/backend/.env',
            'ENVIRONMENT': '/app/backend/.env'
        },
        'frontend': {
            'VITE_BACKEND_URL': '/app/frontend/.env',
            'VITE_APP_NAME': '/app/frontend/.env',
            'VITE_ENVIRONMENT': '/app/frontend/.env'
        }
    }
    
    all_good = True
    for service, vars_dict in required_vars.items():
        print(f"\n🔍 Checking {service} environment variables...")
        for var_name, env_file in vars_dict.items():
            if os.path.exists(env_file):
                with open(env_file, 'r') as f:
                    content = f.read()
                    # Check if variable is set and not a placeholder
                    var_line = [line for line in content.split('\n') if line.startswith(f"{var_name}=")]
                    if var_line and not any(placeholder in var_line[0] for placeholder in ["your_", "placeholder", "example"]):
                        print(f"✅ {var_name}: Configured")
                    else:
                        print(f"❌ {var_name}: Missing or placeholder value")
                        all_good = False
            else:
                print(f"❌ {env_file}: File not found")
                all_good = False
    
    return all_good

def check_supervisor_services():
    """Check supervisor service configurations"""
    try:
        result = subprocess.run(['sudo', 'supervisorctl', 'status'], 
                              capture_output=True, text=True, timeout=10)
        
        # Accept return codes 0 (all good) and 3 (some services not running but command succeeded)
        if result.returncode in [0, 3]:
            output = result.stdout
            services = ['backend', 'frontend']
            all_running = True
            
            print("\n🔍 Checking supervisor services...")
            for service in services:
                # Check if service is running on its line
                service_running = any(f"{service}" in line and "RUNNING" in line for line in output.split('\n'))
                if service_running:
                    print(f"✅ {service}: Running")
                else:
                    print(f"❌ {service}: Not running or not configured")
                    all_running = False
            
            return all_running
        else:
            print(f"❌ Supervisor: Command failed (code {result.returncode}) - {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Supervisor: {str(e)}")
        return False

def check_build_artifacts():
    """Validate build artifacts exist"""
    artifacts = [
        '/app/frontend/dist/index.html',
        '/app/frontend/dist/assets',
        '/app/frontend/dist/sitemap.xml',
        '/app/frontend/dist/robots.txt',
        '/app/frontend/dist/site.webmanifest'
    ]
    
    print("\n🔍 Checking build artifacts...")
    all_good = True
    for artifact in artifacts:
        if os.path.exists(artifact):
            print(f"✅ {artifact}: Present")
        else:
            print(f"❌ {artifact}: Missing")
            all_good = False
    
    return all_good

def check_database_service():
    """Check if MongoDB is running"""
    try:
        result = subprocess.run(['pgrep', 'mongod'], 
                              capture_output=True, text=True, timeout=5)
        
        print("\n🔍 Checking database service...")
        if result.returncode == 0:
            print("✅ MongoDB: Running")
            return True
        else:
            print("❌ MongoDB: Not running")
            return False
    except Exception as e:
        print(f"❌ MongoDB: {str(e)}")
        return False

def check_port_availability():
    """Check if required ports are in use"""
    ports = [3000, 8001]
    
    print("\n🔍 Checking port usage...")
    all_good = True
    for port in ports:
        try:
            result = subprocess.run(['netstat', '-tlnp'], 
                                  capture_output=True, text=True, timeout=5)
            if f":{port}" in result.stdout:
                print(f"✅ Port {port}: In use (service running)")
            else:
                print(f"❌ Port {port}: Not in use (service may be down)")
                all_good = False
        except Exception as e:
            print(f"❌ Port {port}: Check failed - {str(e)}")
            all_good = False
    
    return all_good

def check_security_configuration():
    """Validate security configurations"""
    print("\n🔍 Checking security configuration...")
    
    # Check CORS configuration
    backend_env = '/app/backend/.env'
    if os.path.exists(backend_env):
        with open(backend_env, 'r') as f:
            content = f.read()
            if 'CORS_ORIGINS=' in content and '["*"]' not in content:
                print("✅ CORS: Properly configured (not wildcard)")
                cors_ok = True
            else:
                print("❌ CORS: Using wildcard or not configured")
                cors_ok = False
    else:
        print("❌ CORS: Backend .env not found")
        cors_ok = False
    
    # Check CSP in frontend
    index_html = '/app/frontend/dist/index.html'
    if os.path.exists(index_html):
        with open(index_html, 'r') as f:
            content = f.read()
            if 'Content-Security-Policy' in content:
                print("✅ CSP: Content Security Policy configured")
                csp_ok = True
            else:
                print("❌ CSP: Content Security Policy missing")
                csp_ok = False
    else:
        print("❌ CSP: Frontend index.html not found")
        csp_ok = False
    
    return cors_ok and csp_ok

def check_seo_configuration():
    """Validate SEO/AEO configuration"""
    print("\n🔍 Checking SEO/AEO configuration...")
    
    index_html = '/app/frontend/dist/index.html'
    if os.path.exists(index_html):
        with open(index_html, 'r') as f:
            content = f.read()
            
            checks = [
                ('Canonical URL', 'rel="canonical"'),
                ('Open Graph', 'property="og:'),
                ('Twitter Cards', 'name="twitter:'),
                ('Structured Data', 'application/ld+json'),
                ('Production URLs', 'sec-elite-pwa.emergent.host')
            ]
            
            all_good = True
            for name, pattern in checks:
                if pattern in content:
                    print(f"✅ {name}: Configured")
                else:
                    print(f"❌ {name}: Missing or incorrect")
                    all_good = False
            
            return all_good
    else:
        print("❌ SEO: Frontend index.html not found")
        return False

def main():
    """Run deployment readiness checks"""
    print("🚀 Copperhead Consulting - Deployment Readiness Check")
    print("=" * 60)
    
    checks = [
        ("Environment Variables", check_environment_variables),
        ("Supervisor Services", check_supervisor_services),
        ("Build Artifacts", check_build_artifacts),
        ("Database Service", check_database_service),
        ("Port Availability", check_port_availability),
        ("Security Configuration", check_security_configuration),
        ("SEO/AEO Configuration", check_seo_configuration)
    ]
    
    results = []
    for name, check_func in checks:
        result = check_func()
        results.append((name, result))
    
    print("\n" + "=" * 60)
    print("📊 DEPLOYMENT READINESS SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for name, result in results:
        status = "✅ READY" if result else "❌ NOT READY"
        print(f"{status} - {name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Readiness Score: {passed}/{total} ({(passed/total)*100:.1f}%)")
    
    if passed == total:
        print("🎉 DEPLOYMENT READY - ALL SYSTEMS GO")
        return 0
    elif passed >= total * 0.9:
        print("⚠️  MOSTLY READY - MINOR ISSUES TO ADDRESS")
        return 1
    else:
        print("🚨 NOT READY FOR DEPLOYMENT - CRITICAL ISSUES")
        return 2

if __name__ == "__main__":
    sys.exit(main())
