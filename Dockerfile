# Multi-stage Dockerfile for Copperhead CI PWA
# Stage 1: Build Frontend
FROM node:20.19.5 AS frontend-builder

WORKDIR /build-frontend

# Copy only necessary frontend files
COPY frontend/package.json frontend/yarn.lock ./

# Install dependencies with better error handling
RUN yarn install --frozen-lockfile --production=false || \
    (echo "Dependency installation failed" && exit 1)

# Copy frontend source files
COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/index.html ./
COPY frontend/vite.config.ts ./
COPY frontend/tsconfig.json ./
COPY frontend/tsconfig.node.json ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./

# Build frontend - output goes to /build-frontend/dist
RUN yarn build || (echo "Frontend build failed" && exit 1)

# Stage 2: Setup Backend
FROM python:3.11-slim AS backend-setup

WORKDIR /build-backend

# Copy backend requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/server.py ./

# Stage 3: Production Runtime
FROM python:3.11-slim

WORKDIR /app

# Copy backend from backend-setup stage
COPY --from=backend-setup /build-backend/server.py ./backend/
COPY --from=backend-setup /build-backend/requirements.txt ./backend/
COPY --from=backend-setup /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /build-frontend/dist ./frontend/dist

# Set working directory to backend
WORKDIR /app/backend

# Expose only backend port (it serves both API and frontend)
EXPOSE 8001

# Start backend server (it serves the frontend via FastAPI)
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]