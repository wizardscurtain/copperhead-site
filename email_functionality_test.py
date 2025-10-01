#!/usr/bin/env python3
"""
Critical Email Functionality Test for Copperhead Consulting PWA
This test specifically verifies the email sending functionality issue
"""

import requests
import json
import os
from datetime import datetime

def test_email_configuration():
    """Test if email configuration is production-ready"""
    print("🔍 Testing Email Configuration...")
    
    # Check backend .env file
    env_path = "/app/backend/.env"
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            env_content = f.read()
            
        print(f"📄 Backend .env content:")
        for line in env_content.split('\n'):
            if 'RESEND_API_KEY' in line:
                print(f"   {line}")
                if 'your_resend_api_key_here' in line:
                    print("❌ CRITICAL: RESEND_API_KEY is still a placeholder!")
                    return False
                elif not line.split('=')[1].strip():
                    print("❌ CRITICAL: RESEND_API_KEY is empty!")
                    return False
                else:
                    print("✅ RESEND_API_KEY appears to be configured")
                    return True
    else:
        print("❌ Backend .env file not found")
        return False

def test_email_sending_behavior():
    """Test actual email sending behavior by checking logs"""
    print("\n🔍 Testing Email Sending Behavior...")
    
    # Clear recent logs by making a test request
    contact_data = {
        "name": "Email Test User",
        "email": "emailtest@example.com",
        "phone": "(555) 999-8888",
        "company": "Email Test Company",
        "service": "Email Testing",
        "message": "This is a test to verify email functionality - should send REAL email, not just log.",
        "urgency": "high",
        "consent": True
    }
    
    try:
        response = requests.post(
            "http://localhost:8001/api/send-email",
            json=contact_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"📤 Email API Response: {response.status_code}")
        if response.status_code == 200:
            response_data = response.json()
            print(f"   Response: {response_data}")
            
            # Check logs for the telltale sign of mocked email
            import subprocess
            try:
                log_result = subprocess.run(
                    ['tail', '-n', '10', '/var/log/supervisor/backend.err.log'],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                
                log_content = log_result.stdout
                print(f"\n📋 Recent Backend Logs:")
                print(log_content)
                
                if "EMAIL WOULD BE SENT" in log_content:
                    print("❌ CRITICAL: Email is being LOGGED, not SENT!")
                    print("   This violates the 'NO stubs/placeholders' requirement")
                    return False
                elif "Failed to send email via Resend" in log_content:
                    print("⚠️  Email sending attempted but failed (API key issue)")
                    return False
                else:
                    print("✅ No obvious email mocking detected in logs")
                    return True
                    
            except Exception as e:
                print(f"⚠️  Could not check logs: {e}")
                return None
                
        else:
            print(f"❌ Email API failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Email test failed: {e}")
        return False

def test_resend_api_integration():
    """Test if Resend API integration is working"""
    print("\n🔍 Testing Resend API Integration...")
    
    # Check if we can import and test the email sending function
    try:
        # Read the server.py file to check the implementation
        with open('/app/backend/server.py', 'r') as f:
            server_content = f.read()
            
        if 'EMAIL WOULD BE SENT' in server_content:
            print("❌ CRITICAL: Server code contains email mocking fallback")
            print("   Found 'EMAIL WOULD BE SENT' in server.py - this is a stub!")
            return False
        elif 'your_resend_api_key_here' in server_content:
            print("❌ CRITICAL: Server code references placeholder API key")
            return False
        else:
            print("✅ Server code appears to have real email integration")
            return True
            
    except Exception as e:
        print(f"❌ Could not analyze server code: {e}")
        return False

def main():
    print("🚨 CRITICAL EMAIL FUNCTIONALITY TEST")
    print("=" * 60)
    print("Testing for production-ready email functionality")
    print("NO stubs, placeholders, or mock data allowed")
    print("=" * 60)
    
    results = {
        'timestamp': datetime.now().isoformat(),
        'tests': {},
        'critical_issues': [],
        'production_ready': False
    }
    
    # Test 1: Email Configuration
    config_result = test_email_configuration()
    results['tests']['email_configuration'] = config_result
    if not config_result:
        results['critical_issues'].append("RESEND_API_KEY is not properly configured")
    
    # Test 2: Email Sending Behavior
    behavior_result = test_email_sending_behavior()
    results['tests']['email_sending_behavior'] = behavior_result
    if behavior_result is False:
        results['critical_issues'].append("Email functionality is mocked/stubbed - only logs emails")
    
    # Test 3: Resend API Integration
    integration_result = test_resend_api_integration()
    results['tests']['resend_api_integration'] = integration_result
    if not integration_result:
        results['critical_issues'].append("Server code contains email mocking fallbacks")
    
    # Overall Assessment
    all_passed = all([config_result, behavior_result, integration_result])
    results['production_ready'] = all_passed
    
    print("\n" + "=" * 60)
    print("📊 EMAIL FUNCTIONALITY TEST RESULTS")
    print("=" * 60)
    
    if results['critical_issues']:
        print("❌ CRITICAL ISSUES FOUND:")
        for issue in results['critical_issues']:
            print(f"   • {issue}")
        print(f"\n🚨 PRODUCTION BLOCKER: Email functionality is NOT production-ready")
        print("   User requirement: 'NO placeholders, stubs or mock data'")
        print("   Current state: Email sending is mocked/stubbed")
    else:
        print("✅ All email functionality tests passed")
        print("✅ Email system appears production-ready")
    
    # Save results
    with open('/app/test_reports/email_functionality_test.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/test_reports/email_functionality_test.json")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    exit(main())