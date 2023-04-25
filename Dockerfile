FROM node:18.16.0-bullseye-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y build-essential libudev-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY heart-rate.js ./

EXPOSE 8080

CMD ["node", "heart-rate.js"]