FROM node:20-alpine AS build
WORKDIR /app

# Cache npm dependencies
COPY package*.json ./
RUN npm ci || npm install
COPY vite.config.ts tsconfig.json ./
# Build app
COPY . .
COPY src ./src
COPY public ./public
RUN npm run build



# Production image
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/actuator/health || exit 1
