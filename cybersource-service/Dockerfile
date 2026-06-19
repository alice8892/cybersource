FROM --platform=linux/amd64 node:20-alpine

WORKDIR /app
COPY . /app

RUN npm install

RUN npm run build

RUN chown -R node:node /app

USER node

CMD ["node","build/main/index.js"]
