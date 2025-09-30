FROM node:20.19.5-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage with nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Create nginx configuration
RUN echo 'events { worker_connections 1024; }' > /etc/nginx/nginx.conf && \
    echo 'http {' >> /etc/nginx/nginx.conf && \
    echo '  include /etc/nginx/mime.types;' >> /etc/nginx/nginx.conf && \
    echo '  default_type application/octet-stream;' >> /etc/nginx/nginx.conf && \
    echo '  server {' >> /etc/nginx/nginx.conf && \
    echo '    listen 3000;' >> /etc/nginx/nginx.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/nginx.conf && \
    echo '    index index.html;' >> /etc/nginx/nginx.conf && \
    echo '    location / {' >> /etc/nginx/nginx.conf && \
    echo '      try_files $uri $uri/ /index.html;' >> /etc/nginx/nginx.conf && \
    echo '    }' >> /etc/nginx/nginx.conf && \
    echo '  }' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]