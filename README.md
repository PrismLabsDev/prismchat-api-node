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

# Stop docker
docker-compose -f docker-compose.dev.yml down

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

## Base Configuration

Before we can start the project it requires some very basic configuration. Mainly to allow our domain to be routed to the server.

1. Open ```docker/config/nginx/conf.d/sites.conf``` and replace every ```api1.prism.chat``` to your actual domain.
2. Add the following DNS records to make everything work:

    | Type  | Name  |   Content   |
    | :---: | :---: | :---------: |
    |   A   | api1  | \<ServerIP> |

3. Start the docker environment! This will make the api available on port 80 (HTTP, NOT HTTPS).

    ``` bash
    # Start and Stop docker compose
    docker-compose -f docker-compose.prod.yml up -d --build
    docker-compose -f docker-compose.prod.yml down

    # View status of docker containers
    docker ps -a
    docker logs <container name>

    # Reload Nginx configuration wth zero downtime (Useful for SSL config)
    docker exec prismchat-api-node_nginx_1 nginx -s reload

    # Reset environment
    rm -rf ./docker/volumes
    docker system prune -a
    ```

## SSL Configuration

This project uses certbot to easily install and configure SSL certificates. You can obtain ssl certificates using the "maintenance" container, and will automatically manage certificate renewal. Run the certbot commands replacing ```api1.prism.chat``` with your actual domain.

``` bash
# Test certbot obtaining SSL certificate
docker exec -i prismchat-api-maintenance-1 certbot certonly --webroot --webroot-path /var/certbot/ -d api1.prism.chat --dry-run -v

## Actually obtain certificate
docker exec -i prismchat-api-maintenance-1 certbot certonly --webroot --webroot-path /var/certbot/ -d api1.prism.chat
```

After SSL certificates have been obtained you will need to change the Nginx configuration files to take advantage of HTTPS. Follow the instuctions in the configuration files located at ```docker/config/nginx/conf.d```. Then reload Nginx.

``` bash
docker exec prismchat-api-nginx-1 nginx -s reload
```

### Graceful update

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