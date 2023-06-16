# Base image
FROM node:18-alpine AS base
WORKDIR /foundation

# Install pnpm globally
RUN npm install -g pnpm

# Runner
RUN apk add --no-cache libc6-compat jq
RUN apk update
WORKDIR /foundation

# Set environment
ENV PRISMA_BINARY_TARGETS "native,linux-musl-openssl-3.0.x"

# Install only production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY scripts ./scripts

RUN cd packages/app-engine && pnpm install --frozen-lockfile

EXPOSE 3000

FROM base AS e2e
CMD ["pnpm", "dev"]

FROM base AS production
ENV NODE_ENV production
CMD ["pnpm", "start"]