# =====================================================
# Stage 1: Build the React app
# =====================================================
FROM node:20.18-alpine AS build

WORKDIR /app

# Copy lockfile + package.json first so this layer is cached
# unless dependencies actually change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# =====================================================
# Stage 2: Serve with Nginx
# nginx-unprivileged runs entirely as a non-root user (uid 101)
# and listens on 8080 instead of 80, no root needed anywhere.
# =====================================================
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]