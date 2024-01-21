# Build stage (gets deleted later)

FROM node:20-bookworm-slim as build-stage

## Build client

WORKDIR /usr/src/app/client

COPY ./client/package*.json ./

RUN npm ci

COPY ./client/ ./

RUN npm run build

## Build server

WORKDIR /usr/src/app/server

COPY ./server/package*.json ./

RUN npm ci

COPY ./server/ ./

RUN npm run build


# Final image

FROM node:20-bookworm-slim

## Get client build

WORKDIR /usr/src/app/client

COPY --from=build-stage /usr/src/app/client/dist ./dist

## Get server build

WORKDIR /usr/src/app/server

COPY --from=build-stage /usr/src/app/server/build ./build

COPY ./server/package*.json ./

## Install only production dependencies

RUN npm ci --omit=dev

## Run server

CMD ["npm", "start"]
