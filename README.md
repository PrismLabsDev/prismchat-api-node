# prismchat-api-node

This is the PrismChat server written in TypeScript.

## Development

When developing we use a docker compose file to run an instance of mongodb, and we run the application locally. Follow the instructions below to run the application.

``` bash
# Start docker environment
docker-compose up -d

# Start app
npm install
cp .env.example .env
ts-node ./app/scripts/generateKeys.ts # set .env properties to corresponding values
npm run dev

# Stop docker
docker-compose down

# Run tests
npm run test
```

## Deployment

For production deployment take a look at our compose repo: [prismchat-api-node-compose](https://github.com/PrismLabsDev/prismchat-api-node-compose).
