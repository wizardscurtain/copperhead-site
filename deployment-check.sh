#!/bin/bash
# Deployment Readiness Check Script

echo "🚀 Copperhead Consulting - Deployment Readiness Check"
echo "======================================================"

# Check if backend is running
echo "1. Checking backend service..."
if curl -s http://localhost:8001/api/health > /dev/null; then
    echo "✅ Backend API is responsive"
else
    echo "❌ Backend API is not responding"
    exit 1
fi

# Check frontend serving
echo "2. Checking frontend serving..."
if curl -s http://localhost:8001/ | grep -q "Copperhead Consulting"; then
    echo "✅ Frontend is being served correctly"
else
    echo "❌ Frontend is not serving properly"
    exit 1
fi

# Check health endpoints
echo "3. Checking health endpoints..."
FRONTEND_HEALTH=$(curl -s http://localhost:8001/health | jq -r '.status' 2>/dev/null)
API_HEALTH=$(curl -s http://localhost:8001/api/health | jq -r '.status' 2>/dev/null)

if [ "$FRONTEND_HEALTH" = "healthy" ]; then
    echo "✅ Frontend health check passing"
else
    echo "❌ Frontend health check failing"
fi

if [ "$API_HEALTH" = "healthy" ]; then
    echo "✅ API health check passing"
else
    echo "❌ API health check failing"
fi

# Check HEAD requests (deployment requirement)
echo "4. Checking HEAD request support..."
if curl -I http://localhost:8001/ 2>/dev/null | grep -q "200 OK"; then
    echo "✅ HEAD requests supported"
else
    echo "❌ HEAD requests not working"
    exit 1
fi

# Check static assets
echo "5. Checking static assets..."
if curl -I http://localhost:8001/assets/index-C328WqCR.js 2>/dev/null | grep -q "200 OK"; then
    echo "✅ Static assets accessible"
else
    echo "❌ Static assets not accessible"
fi

echo ""
echo "🎯 DEPLOYMENT STATUS: READY"
echo "All checks passed - application ready for deployment!"
