# Stage 1: Build
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
# Run ci allowing legacy peer deps due to potential conflicts in new Angular versions
RUN npm ci --legacy-peer-deps

COPY . .

# Argument for build environment (dev, qa, prod)
ARG BUILD_ENV=prod
RUN npm run build:${BUILD_ENV}

# Stage 2: Serve
FROM nginx:alpine

# Remove default nginx binding
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts
# Note: Path 'dist/mivoto/browser' or 'dist/mivoto' depends on angular.json config.
# Checking dist structure, it seems to be dist/mivoto based on previous build output.
COPY --from=build /app/dist/mivoto/browser /usr/share/nginx/html

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
