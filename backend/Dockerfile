# ─── Estágio 1: Builder ───────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build

# ─── Estágio 2: Production ────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos o binário compilado e as dependências
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma/

# AQUI ESTÁ A CORREÇÃO DE OURO: Adicionamos a configuração do Prisma 7
COPY prisma.config.ts ./

RUN addgroup -S carehub && adduser -S carehub -G carehub

ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://careuser:carepassword@db:5432/carehub_db?schema=public

USER carehub
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
