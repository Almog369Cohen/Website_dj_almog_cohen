# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Public env vars inlined into client JS at build time
ENV NEXT_PUBLIC_SUPABASE_URL=https://rgfajvnkrszwksiidspm.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-QT5X5pqKmKr0RXOecj3rA_gf-d-1K-

RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
