# Base image
FROM node:18-alpine AS base
WORKDIR /foundation

# Install pnpm globally
RUN npm install -g pnpm

# Dependencies
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages

# Install all dependencies - also the ones for production
RUN pnpm install -r --frozen-lockfile

# Runner
FROM base AS runner
RUN apk add --no-cache libc6-compat jq
RUN apk update
WORKDIR /foundation

# Set environment to production
ENV NODE_ENV production
ENV PRISMA_BINARY_TARGETS "native,linux-musl-openssl-3.0.x"

# Install only production dependencies
COPY . .
RUN cd packages/app-engine && pnpm install --prod --frozen-lockfile

# Expose the port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]