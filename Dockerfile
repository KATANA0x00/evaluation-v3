# --------------------------
# Builder
# --------------------------
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies needed for canvas / native builds
RUN apt-get update && apt-get install -y \
    python3 make g++ pkg-config \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy everything first
COPY package*.json ./
COPY . .

# Clean any prebuilt node_modules or lockfiles
RUN rm -rf node_modules package-lock.json

# Install dependencies inside container (important!)
RUN npm install --build-from-source

# Build Nuxt
RUN npx nuxt build

# --------------------------
# Runner
# --------------------------
FROM node:20-slim
WORKDIR /app

# Runtime libraries for canvas
RUN apt-get update && apt-get install -y \
    libcairo2 libpango1.0-0 libjpeg62-turbo libgif7 librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

# Copy build output and node_modules from builder
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/public /app/public

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
