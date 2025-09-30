import requests
import sys
import json
from datetime import datetime

class CopperheadAPITester:
    def __init__(self, base_url="https://sec-elite-pwa.emergent.host"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.results.append({
                'test': name,
                'endpoint': endpoint,
                'method': method,
                'expected_status': expected_status,
                'actual_status': response.status_code,
                'success': success,
                'response_preview': response.text[:200] if not success else "OK"
            })

            return success, response.json() if success and response.text else {}

        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection Error: Cannot connect to {url}")
            self.results.append({
                'test': name,
                'endpoint': endpoint,
                'method': method,
                'expected_status': expected_status,
                'actual_status': 'CONNECTION_ERROR',
                'success': False,
                'response_preview': 'Cannot connect to server'
            })
            return False, {}
        except requests.exceptions.Timeout:
            print(f"❌ Failed - Timeout: Request to {url} timed out")
            self.results.append({
                'test': name,
                'endpoint': endpoint,
                'method': method,
                'expected_status': expected_status,
                'actual_status': 'TIMEOUT',
                'success': False,
                'response_preview': 'Request timed out'
            })
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.results.append({
                'test': name,
                'endpoint': endpoint,
                'method': method,
                'expected_status': expected_status,
                'actual_status': 'ERROR',
                'success': False,
                'response_preview': str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )

    def test_contact_form_valid(self):
        """Test contact form with valid data"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "(555) 123-4567",
            "company": "Test Company",
            "service": "Executive Protection",
            "message": "This is a test message for the contact form functionality.",
            "urgency": "standard",
            "consent": True
        }
        
        return self.run_test(
            "Contact Form - Valid Data",
            "POST",
            "api/send-email",
            200,
            data=contact_data
        )

    def test_contact_form_missing_consent(self):
        """Test contact form without consent"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "service": "Executive Protection",
            "message": "This is a test message.",
            "consent": False
        }
        
        return self.run_test(
            "Contact Form - Missing Consent",
            "POST",
            "api/send-email",
            400,
            data=contact_data
        )

    def test_contact_form_invalid_email(self):
        """Test contact form with invalid email"""
        contact_data = {
            "name": "Test User",
            "email": "invalid-email",
            "service": "Executive Protection",
            "message": "This is a test message.",
            "consent": True
        }
        
        return self.run_test(
            "Contact Form - Invalid Email",
            "POST",
            "api/send-email",
            422,  # Pydantic validation error
            data=contact_data
        )

    def test_quote_request_valid(self):
        """Test quote request with valid data"""
        quote_data = {
            "name": "Test Client",
            "email": "client@example.com",
            "phone": "(555) 987-6543",
            "company": "Client Company",
            "services": ["Executive Protection", "Security Consulting"],
            "message": "We need comprehensive security services for our executive team.",
            "urgency": "high",
            "timeline": "Within 1 week",
            "budget": "$50,000 - $100,000",
            "consent": True
        }
        
        return self.run_test(
            "Quote Request - Valid Data",
            "POST",
            "api/quote-request",
            200,
            data=quote_data
        )

    def test_quote_request_missing_consent(self):
        """Test quote request without consent"""
        quote_data = {
            "name": "Test Client",
            "email": "client@example.com",
            "services": ["Executive Protection"],
            "message": "Test message",
            "consent": False
        }
        
        return self.run_test(
            "Quote Request - Missing Consent",
            "POST",
            "api/quote-request",
            400,
            data=quote_data
        )

    def test_cors_headers(self):
        """Test CORS headers"""
        print(f"\n🔍 Testing CORS Headers...")
        try:
            response = requests.options(f"{self.base_url}/api/health", timeout=10)
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
            }
            print(f"   CORS Headers: {cors_headers}")
            return True
        except Exception as e:
            print(f"❌ CORS test failed: {str(e)}")
            return False

def main():
    print("🚀 Starting Copperhead Consulting API Tests")
    print("=" * 50)
    
    # Test with the configured backend URL
    tester = CopperheadAPITester("https://sec-elite-pwa.emergent.host")
    
    # Run all tests
    print("\n📋 Running Backend API Tests...")
    
    # Basic connectivity
    health_success, _ = tester.test_health_check()
    if not health_success:
        print("\n❌ Backend server is not accessible. Stopping tests.")
        print("   Please ensure the backend server is running on port 8001")
        return 1
    
    # Contact form tests
    tester.test_contact_form_valid()
    tester.test_contact_form_missing_consent()
    tester.test_contact_form_invalid_email()
    
    # Quote request tests
    tester.test_quote_request_valid()
    tester.test_quote_request_missing_consent()
    
    # CORS test
    tester.test_cors_headers()
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results Summary:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Print failed tests
    failed_tests = [r for r in tester.results if not r['success']]
    if failed_tests:
        print(f"\n❌ Failed Tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   • {test['test']}: {test['response_preview']}")
    
    # Save detailed results
    with open('/app/test_reports/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'tests_run': tester.tests_run,
                'tests_passed': tester.tests_passed,
                'success_rate': (tester.tests_passed/tester.tests_run)*100 if tester.tests_run > 0 else 0
            },
            'results': tester.results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/test_reports/backend_test_results.json")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())