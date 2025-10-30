#!/usr/bin/env python3
"""
Comprehensive Health Check Script for Copperhead Consulting Application
Validates all critical system components and security configurations
"""

import requests
import json
import sys
import time
from urllib.parse import urljoin

# Configuration
BASE_URL = "http://localhost:8001"
FRONTEND_URL = "http://localhost:3000"
TIMEOUT = 10

def check_backend_health():
    """Check backend API health"""
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend Health: {data['status']} (v{data['version']})")
            return True
        else:
            print(f"❌ Backend Health: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend Health: {str(e)}")
        return False

def check_frontend_availability():
    """Check frontend availability"""
    try:
        response = requests.get(FRONTEND_URL, timeout=TIMEOUT)
        if response.status_code == 200 and "Copperhead Consulting" in response.text:
            print("✅ Frontend: Available and serving content")
            return True
        else:
            print(f"❌ Frontend: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend: {str(e)}")
        return False

def check_security_headers():
    """Validate security headers"""
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=TIMEOUT)
        headers = response.headers
        
        required_headers = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'Content-Security-Policy': 'default-src',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
        
        missing_headers = []
        for header, expected in required_headers.items():
            if header not in headers:
                missing_headers.append(header)
            elif expected not in headers[header]:
                missing_headers.append(f"{header} (incorrect value)")
        
        if not missing_headers:
            print("✅ Security Headers: All required headers present")
            return True
        else:
            print(f"❌ Security Headers: Missing {', '.join(missing_headers)}")
            return False
    except Exception as e:
        print(f"❌ Security Headers: {str(e)}")
        return False

def check_csrf_protection():
    """Test CSRF token generation"""
    try:
        response = requests.post(f"{BASE_URL}/api/csrf-token", timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            if 'csrf_token' in data and 'expires_in' in data:
                print("✅ CSRF Protection: Token generation working")
                return True
        print(f"❌ CSRF Protection: HTTP {response.status_code}")
        return False
    except Exception as e:
        print(f"❌ CSRF Protection: {str(e)}")
        return False

def check_database_connection():
    """Check database connectivity through debug endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/debug", timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'ok':
                print("✅ Database: Connection available")
                return True
        print(f"❌ Database: Connection failed")
        return False
    except Exception as e:
        print(f"❌ Database: {str(e)}")
        return False

def check_static_files():
    """Check critical static files"""
    static_files = [
        '/sitemap.xml',
        '/robots.txt',
        '/site.webmanifest'
    ]
    
    all_good = True
    for file_path in static_files:
        try:
            response = requests.get(f"{FRONTEND_URL}{file_path}", timeout=TIMEOUT)
            if response.status_code == 200:
                print(f"✅ Static File: {file_path} available")
            else:
                print(f"❌ Static File: {file_path} HTTP {response.status_code}")
                all_good = False
        except Exception as e:
            print(f"❌ Static File: {file_path} - {str(e)}")
            all_good = False
    
    return all_good

def check_seo_meta_tags():
    """Validate SEO meta tags in homepage"""
    try:
        response = requests.get(FRONTEND_URL, timeout=TIMEOUT)
        if response.status_code == 200:
            content = response.text
            
            # Check for critical SEO elements
            seo_checks = [
                ('canonical', 'rel="canonical"'),
                ('og:url', 'property="og:url"'),
                ('og:title', 'property="og:title"'),
                ('og:description', 'property="og:description"'),
                ('og:image', 'property="og:image"'),
                ('twitter:card', 'name="twitter:card"'),
                ('structured data', 'application/ld+json'),
                ('production URL', 'sec-elite-pwa.emergent.host')
            ]
            
            missing_seo = []
            for name, pattern in seo_checks:
                if pattern not in content:
                    missing_seo.append(name)
            
            if not missing_seo:
                print("✅ SEO/AEO: All meta tags and structured data present")
                return True
            else:
                print(f"❌ SEO/AEO: Missing {', '.join(missing_seo)}")
                return False
        else:
            print(f"❌ SEO/AEO: Cannot fetch homepage (HTTP {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ SEO/AEO: {str(e)}")
        return False

def main():
    """Run comprehensive health checks"""
    print("🔍 Copperhead Consulting - System Health Check")
    print("=" * 50)
    
    checks = [
        ("Backend Health", check_backend_health),
        ("Frontend Availability", check_frontend_availability),
        ("Security Headers", check_security_headers),
        ("CSRF Protection", check_csrf_protection),
        ("Database Connection", check_database_connection),
        ("Static Files", check_static_files),
        ("SEO/AEO Meta Tags", check_seo_meta_tags)
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\n🔍 Checking {name}...")
        result = check_func()
        results.append((name, result))
        time.sleep(0.5)  # Brief pause between checks
    
    print("\n" + "=" * 50)
    print("📊 HEALTH CHECK SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall Score: {passed}/{total} ({(passed/total)*100:.1f}%)")
    
    if passed == total:
        print("🎉 ALL SYSTEMS OPERATIONAL - READY FOR DEPLOYMENT")
        return 0
    elif passed >= total * 0.8:
        print("⚠️  MOSTLY OPERATIONAL - MINOR ISSUES DETECTED")
        return 1
    else:
        print("🚨 CRITICAL ISSUES DETECTED - REQUIRES ATTENTION")
        return 2

if __name__ == "__main__":
    sys.exit(main())
