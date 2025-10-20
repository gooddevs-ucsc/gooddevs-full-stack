# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./

# Stage 2: Development
FROM base AS development
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "3000"]

# Stage 3: Builder (for production)
FROM base AS builder
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 4: Production
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
# Uncomment the next line if you need a custom nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]