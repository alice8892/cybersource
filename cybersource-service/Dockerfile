FROM --platform=linux/amd64 node:20.8.0-slim

WORKDIR /app
COPY . /app

RUN npm install

RUN npm run build

CMD ["node","build/main/index.js"]