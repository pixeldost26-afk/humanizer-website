# Production Dockerfile for Render Deployment
FROM node:20-slim AS base
WORKDIR /app

# Install OpenSSL for Prisma engine compatibility
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# 1. Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# 2. Build application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Placeholder DATABASE_URL to satisfy Prisma during build phase
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate
RUN npm run build

# 3. Production runner
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=10000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

EXPOSE 10000

CMD ["npm", "run", "start:prod"]
