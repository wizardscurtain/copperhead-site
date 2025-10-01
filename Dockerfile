# Multi-stage Dockerfile for Copperhead CI PWA
# Stage 1: Build Frontend
FROM node:20.19.5-alpine AS frontend-builder

WORKDIR /build-frontend

# Copy only necessary frontend files
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

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
RUN yarn build

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

# Install Node.js for serving frontend
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    npm install -g serve && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy backend from backend-setup stage
COPY --from=backend-setup /build-backend /app/backend
COPY --from=backend-setup /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /build-frontend/dist /app/frontend/dist

# Create startup script
RUN echo '#!/bin/bash\n\
cd /app/backend && uvicorn server:app --host 0.0.0.0 --port 8001 &\n\
cd /app/frontend/dist && serve -s . -l 3000 &\n\
wait' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 3000 8001

CMD ["/app/start.sh"]