# Build stage
FROM node:18 as build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create custom nginx configuration
RUN echo 'client_max_body_size 20M;' > /etc/nginx/conf.d/client_max_body_size.conf && \
    echo 'server_tokens off;' > /etc/nginx/conf.d/server_tokens.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
