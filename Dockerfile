FROM node:22-alpine AS base
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM base AS builder
COPY . .
RUN pnpm db:generate
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
