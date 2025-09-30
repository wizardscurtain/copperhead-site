#!/bin/bash
# Deployment build script with comprehensive error handling

set -e  # Exit on any error
set -x  # Show commands being executed

echo "[BUILD_LOG] Starting deployment build process..."

# Ensure we're in the right directory
cd /app/frontend

echo "[BUILD_LOG] Node.js version: $(node --version)"
echo "[BUILD_LOG] Yarn version: $(yarn --version)"

# Clean previous build artifacts
echo "[BUILD_LOG] Cleaning previous build artifacts..."
rm -rf node_modules/.vite
rm -rf dist

# Install dependencies with error handling
echo "[BUILD_LOG] Installing dependencies..."
yarn install --frozen-lockfile --network-timeout 300000

if [ $? -ne 0 ]; then
    echo "[BUILD_ERROR] Dependency installation failed"
    exit 1
fi

# Verify critical dependencies
echo "[BUILD_LOG] Verifying critical dependencies..."
node -e "console.log('React:', require('react/package.json').version)"
node -e "console.log('Vite:', require('vite/package.json').version)"

# Run TypeScript check
echo "[BUILD_LOG] Running TypeScript check..."
npx tsc --noEmit --skipLibCheck

if [ $? -ne 0 ]; then
    echo "[BUILD_ERROR] TypeScript compilation failed"
    exit 1
fi

# Build with memory optimization
echo "[BUILD_LOG] Building application with memory optimization..."
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build

if [ $? -ne 0 ]; then
    echo "[BUILD_ERROR] Application build failed"
    exit 1
fi

echo "[BUILD_LOG] Build completed successfully!"
echo "[BUILD_LOG] Build artifacts:"
ls -la dist/

echo "[BUILD_LOG] Deployment build process complete!"
