# Build stage
FROM --platform=linux/amd64 node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# Production stage
FROM --platform=linux/amd64 node:20-alpine

RUN apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/build ./build
COPY --from=builder /app/src/resources ./src/resources

RUN chown -R node:node /app

USER node

CMD ["node","build/main/index.js"]
