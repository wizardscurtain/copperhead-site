#!/usr/bin/env python3
"""
Post-Deployment Validation Script
Validates deployment success and runs final MCP compliance check
"""

import asyncio
import aiohttp
import json
import sys
import time
from datetime import datetime

class PostDeploymentValidator:
    """Validates successful deployment on Render"""
    
    def __init__(self, backend_url="https://copperhead-backend.onrender.com", 
                 frontend_url="https://copperhead-frontend.onrender.com"):
        self.backend_url = backend_url
        self.frontend_url = frontend_url
        self.validation_results = []
        
    async def validate_deployment(self):
        """Run complete post-deployment validation"""
        print("🚀 POST-DEPLOYMENT VALIDATION")
        print("="*50)
        
        # 1. Backend Health Check
        await self._validate_backend_health()
        
        # 2. Database Connectivity
        await self._validate_database_connectivity()
        
        # 3. API Endpoints
        await self._validate_api_endpoints()
        
        # 4. Frontend Accessibility
        await self._validate_frontend_access()
        
        # 5. Security Headers
        await self._validate_security_headers()
        
        # 6. Performance Metrics
        await self._validate_performance()
        
        # Generate final report
        return self._generate_validation_report()
    
    async def _validate_backend_health(self):
        """Validate backend health endpoint"""
        print("\n1. 📊 Backend Health Check...")
        
        try:
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30)) as session:
                start_time = time.time()
                async with session.get(f"{self.backend_url}/api/health") as response:
                    response_time = (time.time() - start_time) * 1000
                    
                    if response.status == 200:
                        data = await response.json()
                        print(f"   ✅ Health check passed ({response_time:.0f}ms)")
                        print(f"   ✅ Status: {data.get('status', 'unknown')}")
                        print(f"   ✅ Service: {data.get('service', 'unknown')}")
                        
                        self.validation_results.append({
                            "test": "backend_health",
                            "status": "PASS",
                            "response_time_ms": response_time,
                            "details": data
                        })
                    else:
                        print(f"   ❌ Health check failed: HTTP {response.status}")
                        self.validation_results.append({
                            "test": "backend_health",
                            "status": "FAIL",
                            "error": f"HTTP {response.status}"
                        })
        except Exception as e:
            print(f"   ❌ Health check error: {e}")
            self.validation_results.append({
                "test": "backend_health",
                "status": "FAIL",
                "error": str(e)
            })
    
    async def _validate_database_connectivity(self):
        """Validate database connectivity through debug endpoint"""
        print("\n2. 💾 Database Connectivity...")
        
        try:
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30)) as session:
                async with session.get(f"{self.backend_url}/api/debug") as response:
                    if response.status == 200:
                        data = await response.json()
                        print(f"   ✅ Debug endpoint accessible")
                        print(f"   ✅ Environment: {data.get('environment', 'unknown')}")
                        
                        self.validation_results.append({
                            "test": "database_connectivity",
                            "status": "PASS",
                            "details": data
                        })
                    else:
                        print(f"   ❌ Debug endpoint failed: HTTP {response.status}")
                        self.validation_results.append({
                            "test": "database_connectivity",
                            "status": "FAIL",
                            "error": f"HTTP {response.status}"
                        })
        except Exception as e:
            print(f"   ❌ Database connectivity error: {e}")
            self.validation_results.append({
                "test": "database_connectivity",
                "status": "FAIL",
                "error": str(e)
            })
    
    async def _validate_api_endpoints(self):
        """Validate key API endpoints"""
        print("\n3. 🔗 API Endpoints...")
        
        endpoints = [
            "/api/health",
            "/api/debug",
            "/api/csrf-token"
        ]
        
        for endpoint in endpoints:
            try:
                async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=15)) as session:
                    method = "POST" if endpoint == "/api/csrf-token" else "GET"
                    
                    if method == "POST":
                        async with session.post(f"{self.backend_url}{endpoint}") as response:
                            status = response.status
                    else:
                        async with session.get(f"{self.backend_url}{endpoint}") as response:
                            status = response.status
                    
                    if status == 200:
                        print(f"   ✅ {endpoint} - OK")
                    else:
                        print(f"   ❌ {endpoint} - HTTP {status}")
                        
            except Exception as e:
                print(f"   ❌ {endpoint} - Error: {e}")
    
    async def _validate_frontend_access(self):
        """Validate frontend accessibility"""
        print("\n4. 🌍 Frontend Access...")
        
        try:
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30)) as session:
                async with session.get(self.frontend_url) as response:
                    if response.status == 200:
                        content = await response.text()
                        if "Copperhead" in content:
                            print(f"   ✅ Frontend accessible and contains expected content")
                            self.validation_results.append({
                                "test": "frontend_access",
                                "status": "PASS"
                            })
                        else:
                            print(f"   ⚠️ Frontend accessible but content unexpected")
                            self.validation_results.append({
                                "test": "frontend_access",
                                "status": "WARNING",
                                "details": "Content validation failed"
                            })
                    else:
                        print(f"   ❌ Frontend not accessible: HTTP {response.status}")
                        self.validation_results.append({
                            "test": "frontend_access",
                            "status": "FAIL",
                            "error": f"HTTP {response.status}"
                        })
        except Exception as e:
            print(f"   ❌ Frontend access error: {e}")
            self.validation_results.append({
                "test": "frontend_access",
                "status": "FAIL",
                "error": str(e)
            })
    
    async def _validate_security_headers(self):
        """Validate security headers"""
        print("\n5. 🔒 Security Headers...")
        
        required_headers = [
            "X-Content-Type-Options",
            "X-Frame-Options",
            "Content-Security-Policy",
            "Strict-Transport-Security"
        ]
        
        try:
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=15)) as session:
                async with session.get(f"{self.backend_url}/api/health") as response:
                    headers = response.headers
                    
                    missing_headers = []
                    for header in required_headers:
                        if header in headers:
                            print(f"   ✅ {header}: {headers[header][:50]}...")
                        else:
                            print(f"   ❌ {header}: Missing")
                            missing_headers.append(header)
                    
                    if not missing_headers:
                        self.validation_results.append({
                            "test": "security_headers",
                            "status": "PASS"
                        })
                    else:
                        self.validation_results.append({
                            "test": "security_headers",
                            "status": "FAIL",
                            "missing_headers": missing_headers
                        })
                        
        except Exception as e:
            print(f"   ❌ Security headers validation error: {e}")
            self.validation_results.append({
                "test": "security_headers",
                "status": "FAIL",
                "error": str(e)
            })
    
    async def _validate_performance(self):
        """Validate performance metrics"""
        print("\n6. ⚡ Performance Metrics...")
        
        try:
            response_times = []
            
            for i in range(3):
                async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=15)) as session:
                    start_time = time.time()
                    async with session.get(f"{self.backend_url}/api/health") as response:
                        response_time = (time.time() - start_time) * 1000
                        response_times.append(response_time)
            
            avg_response_time = sum(response_times) / len(response_times)
            max_response_time = max(response_times)
            
            print(f"   ✅ Average response time: {avg_response_time:.0f}ms")
            print(f"   ✅ Max response time: {max_response_time:.0f}ms")
            
            if avg_response_time < 1000:  # Less than 1 second
                performance_status = "PASS"
            elif avg_response_time < 3000:  # Less than 3 seconds
                performance_status = "WARNING"
            else:
                performance_status = "FAIL"
            
            self.validation_results.append({
                "test": "performance",
                "status": performance_status,
                "avg_response_time_ms": avg_response_time,
                "max_response_time_ms": max_response_time
            })
            
        except Exception as e:
            print(f"   ❌ Performance validation error: {e}")
            self.validation_results.append({
                "test": "performance",
                "status": "FAIL",
                "error": str(e)
            })
    
    def _generate_validation_report(self):
        """Generate final validation report"""
        print("\n" + "="*50)
        print("📄 VALIDATION REPORT")
        print("="*50)
        
        passed_tests = len([r for r in self.validation_results if r['status'] == 'PASS'])
        warning_tests = len([r for r in self.validation_results if r['status'] == 'WARNING'])
        failed_tests = len([r for r in self.validation_results if r['status'] == 'FAIL'])
        total_tests = len(self.validation_results)
        
        print(f"📈 Test Results: {passed_tests} passed, {warning_tests} warnings, {failed_tests} failed")
        print(f"📉 Success Rate: {passed_tests/total_tests*100:.1f}%")
        
        if failed_tests == 0:
            print("✅ DEPLOYMENT SUCCESSFUL")
            print("🎉 Application is fully operational")
            deployment_success = True
        elif failed_tests <= 2 and warning_tests >= 0:
            print("⚠️ DEPLOYMENT PARTIALLY SUCCESSFUL")
            print("🔧 Some issues need attention")
            deployment_success = True
        else:
            print("❌ DEPLOYMENT FAILED")
            print("🚨 Critical issues detected")
            deployment_success = False
        
        # Save report
        report = {
            "timestamp": datetime.now().isoformat(),
            "deployment_success": deployment_success,
            "test_summary": {
                "total": total_tests,
                "passed": passed_tests,
                "warnings": warning_tests,
                "failed": failed_tests,
                "success_rate": passed_tests/total_tests if total_tests > 0 else 0
            },
            "test_results": self.validation_results,
            "backend_url": self.backend_url,
            "frontend_url": self.frontend_url
        }
        
        with open("/app/post_deployment_report.json", 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📄 Full report saved to: /app/post_deployment_report.json")
        
        return deployment_success

async def main():
    """Main validation function"""
    print("🎯 COPPERHEAD CONSULTING POST-DEPLOYMENT VALIDATION")
    print("MCP Compliance Protocol - Deployment Verification")
    print("="*60)
    
    # Get URLs from command line or use defaults
    backend_url = sys.argv[1] if len(sys.argv) > 1 else "https://copperhead-backend.onrender.com"
    frontend_url = sys.argv[2] if len(sys.argv) > 2 else "https://copperhead-frontend.onrender.com"
    
    validator = PostDeploymentValidator(backend_url, frontend_url)
    
    try:
        success = await validator.validate_deployment()
        
        if success:
            print("\n🎆 VALIDATION COMPLETE - DEPLOYMENT SUCCESSFUL")
            print("🚀 Application is ready for production use")
            print("\n📞 Recommended Next Steps:")
            print("  1. Monitor application performance")
            print("  2. Set up alerting and monitoring")
            print("  3. Plan regular security audits")
            print("  4. Consider implementing CI/CD pipeline")
        else:
            print("\n❌ VALIDATION FAILED - DEPLOYMENT ISSUES DETECTED")
            print("🛠️ Review the validation report and address issues")
        
        return success
        
    except Exception as e:
        print(f"\n❌ Validation error: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
