# First stage: builder
FROM node:18.16.0-bullseye-slim AS builder

WORKDIR /app

RUN apt-get update && \
    apt-get install -y build-essential libudev-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --only=production

# Second stage: final image
FROM node:18.16.0-bullseye-slim

WORKDIR /app

# Copy the runtime dependencies from the builder stage
COPY --from=builder /app/node_modules /app/node_modules

COPY heart-rate.js ./

EXPOSE 8080

CMD ["node", "heart-rate.js"]