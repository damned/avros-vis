FROM node

WORKDIR /work
COPY . .

ENTRYPOINT npm install && npm start