# prismchat-api-node

This is the prism chat server written in typescript to be ran on node.

## Development

When developing we use a docker compose file to run an instance of mongodb as the peer (WebRTC) server, and we run the application locally. Follow the instructions below.

``` bash
# Start docker environment
docker-compose -f docker-compose.dev.yml up -d --build

# Start app
npm install
cp .env.example .env
ts-node ./app/scripts/generateKeys.ts # set .env properties to corresponding values
npm run dev

# Run tests
npm run test
```

## Production

We have configured a custom docker image as well as Nginx config to build and server the application with as much ease as possible. On a bare VPS you will first install docker, then clone this repository and run the following commands.

``` bash
cp .env.example .env
docker exec prismchat-api-node-node-1 ts-node ./app/scripts/generateKeys.ts # set .env properties to corresponding values
docker-compose -f docker-compose.prod.yml up -d --build
```

## Graceful update

**Master branch should always reflect that latest stable version!**

To update this application while running on the server and minimize downtime we utilize dockers scale functionality. After making a pull request this will create a new image and run it while keeping the old image running. Then we will take down the previous container running the old image and finally refresh nginx so traffic will be sent to the new container running the newly built image with the updated source code. This method allows us to use docker-compose in production and minimize downtime when updating.

``` bash
# Scale up to 2 containers, new container built from source
docker-compose -f docker-compose.prod.yml up -d --build --scale node=2 --no-recreate

# Scale down to 1 container, by default leaving the latest container built
docker-compose -f docker-compose.prod.yml up -d --build --scale node=1 --no-recreate

# Reload Nginx to switch over traffic
docker exec prismchat-api-node-nginx-1 nginx -s reload
```