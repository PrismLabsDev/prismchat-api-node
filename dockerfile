FROM node:18.16.0 as BASE

LABEL org.opencontainers.image.source="https://github.com/PrismLabsDev/prismchat-api-node"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]
