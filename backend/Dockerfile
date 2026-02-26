# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
# Installs all dependencies and compiles TypeScript → JavaScript
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (leverages Docker layer cache)
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate the client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and compile
COPY . .
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
# Lean image with only production dependencies and compiled output
FROM node:22-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy Prisma schema and regenerate client for production environment
COPY prisma ./prisma/
RUN npx prisma generate

# Copy compiled JavaScript from builder stage
COPY --from=builder /app/dist ./dist

# Non-root user for security
RUN addgroup -S carehub && adduser -S carehub -G carehub
USER carehub

# Expose NestJS default port
EXPOSE 3000

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
