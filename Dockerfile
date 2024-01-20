FROM node:20-bookworm-slim as client-build-stage

WORKDIR /usr/src/app/client

COPY ./client/package*.json ./

RUN npm ci

COPY ./client/ ./

RUN npm run build

FROM node:20-bookworm-slim

WORKDIR /usr/src/app

COPY --from=client-build-stage /usr/src/app/client/dist ./client/dist

WORKDIR /usr/src/app/server

COPY ./server/package*.json ./

RUN npm ci

COPY ./server/ ./

RUN npm run build

CMD ["npm", "start"]
