FROM node:20.9.0 as client-build-stage

WORKDIR /usr/src/app/client

COPY ./client/package*.json ./

RUN npm ci

COPY ./client/ ./

RUN npm run build

FROM node:20.9.0

WORKDIR /usr/src/app

COPY --from=build-stage /usr/src/app/client/dist ./client/dist

WORKDIR /usr/src/app/server

COPY ./server/package*.json ./

RUN npm ci

COPY ./server/ ./

RUN npm run build

CMD ["npm", "start"]
