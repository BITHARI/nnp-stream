# ---- Stage 1: Dependencies ----
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# ---- Stage 2: Build ----
FROM node:22-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (dummy DATABASE_URL needed at build time for prisma.config.ts)
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npx prisma generate

# Build TypeScript
RUN npm run build

# ---- Stage 3: Production ----
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy Prisma schema and generated client
COPY --from=build /app/prisma ./prisma
# COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/src/generated ./src/generated

# Copy compiled output
COPY --from=build /app/dist ./dist

# Create media directory
RUN mkdir -p /app/media

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8000

CMD ["node", "dist/index.js"]
# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
