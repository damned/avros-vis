FROM node

WORKDIR /work
COPY . .

# can still mount into /work for dynamic updates e.g. see docker-compose.yml

ENTRYPOINT npm install && npm start