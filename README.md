# Messenger application

> Full Stack chat application using Node backend and React frontend. Currently includes a global chatroom and private chats.

LIVE ON RENDER: https://messenger-app-3ztg.onrender.com.
Running as a free tier service so it might take some time to start up.

## Summary

Node server has a [REST API](https://www.ibm.com/topics/rest-apis) using [Express](https://expressjs.com/) and WebSockets server using [Socket.io](https://socket.io/).

Users are validated and stored in a [PostgreSQL](https://www.postgresql.org/) database through [TypeORM](https://typeorm.io/). Encrypted private messages are also stored in the postgres database, while global chat is stored in a [Redis](https://redis.io/) database for one hour.

REST API is used for user management and WebSockets are used to transport messages between users real-time.

Project is built with [TypeScript](https://www.typescriptlang.org/).
[Zod](https://zod.dev/)-library is used to validate all inbound data at runtime as TypeScript types exist only until it is compiled into JavaScript. [ESLint](https://eslint.org/) is used to enforce coding-style and format. Both frontend and backend ESLint setups are based on [XO](https://github.com/xojs/xo) rule set.

## Docker

This application can be fully containerized. A [Docker](https://www.docker.com/) image is created on every release. They are stored in the [GitHub Container Registry (ghcr.io)](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry). These images can be found in this repository under `Packages`. Images are tagged with the same release version number as the commit. Latest version is also tagged with the `latest` tag.

### Dockerfile

The Dockerfile used in this application is using a multi-stage build. This means that the application is built in the first stage, and just the final builds are copied to the final stage. Build-stage is not included in the image.

From the frontend, only the dist directory is carried to the final image. From the backend, only the compiled JavaScript files and the production dependencies are carried over. No tests, no TypeScript, and no development dependencies. This reduces the image size to a fraction of what it would be.

The dockerfile is also using a optimized [base Node image](https://hub.docker.com/_/node/). I chose 20-bookworm-slim. The alpine-version is the smallest, but is using an unofficial Node version and has some other disadvantages. ([Read more about the differences](https://snyk.io/blog/choosing-the-best-node-js-docker-image/))



### Image usage

Running this image requires the same environment variables as the app would normally need. This is the template setup that is used in the `docker-compose.standalone.yml`. <b>Don't use the same secret</b>.
```
PORT: 3000
POSTGRES_URL: postgres://postgres:postgres@postgres:5432/postgres
SECRET: sdfnwef80wejw8fjw489fjw48fjw4893f89w4g
REDIS_URL: redis://redis:6379
```

### Render Docker image deployment

The app is deployed in Render also as a [Docker image based web service](https://docs.render.com/deploy-an-image). The CI workflow also deploys the newly created image on Render. For the moment, the <i>Wait for deployment</i> -action doesn't seem to support tracking these prebuilt image web services. Successful deployment therefore is not guaranteed. This is not critical for now, as this secondary deployment is just a demonstration that it can be deployed both ways.

I would otherwise prefer this containerized deployment as there is less configuration on the hosting service. Most of the configuration is done in the dockerfile, and the image content and size can be more optimized.

These separate deployments also have no real-time communication with each other, despite sharing the same databases and this way recovering all messages on a page refresh. I'm interested in looking further into how these real-time chat applications could be scaled horizontally with multiple containers and servers.

The deployed containerized version found here: https://messenger-containerized.onrender.com

More on GitHub Actions and setup below.

## CI/CD

There is a [Github Actions workflow](https://docs.github.com/en/actions/using-workflows/about-workflows) in place to lint, build, test, tag & deploy the application. Everything is tested in pull requests so broken code doesn't get into main branch.

The the CI/CD pipeline consist of these jobs:

### build

Checkouts the code, installs dependencies, runs eslint, builds projects, runs tests (integration tests and end-to-end tests).

Backend integration testing requires a test database, so the build pipeline runs a PostgreSQL Docker container as a service that is used in the pipeline tests. This guarantees that there aren't any external dependencies that would fail the tests (in this case, losing connection to remote test database)

Build job is actually done 3 times concurrently. Each with a different node version: 16.x, 18.x and 20.x. Running different versions is redundant and it could be reduced to only run 20.x as that is currently run on production. But in a project this size, it doesn't affect the build length that much so I think it's nice to be alerted if there are version specific problems.

### tag_release

If build is successful, runs [github-tag-action](https://github.com/anothrNick/github-tag-action) that bumps the tag version of the repository. By default it bumps up the patch version, but minor version and major version can also be bumped by adding #major or #minor to a commit message.

### deployment

If build and tagging are successful, deploys the main branch to [Render](https://render.com/) using [render-deploy-action](https://github.com/johnbeynon/render-deploy-action).
After initializing the deployment, waits for deployment to finish successfully using [render-action](https://github.com/Bounceapp/render-action). It's good to note that these are separate steps to make locating possible problems easier. Free tier render services might take a long time to build and start up if there's a lot of traffic.

### publish_docker_image

If build and tagging are successful, creates a docker image from the application. Also deploys the image to GitHub Container Repository. It gets the version from the tag_release job output, and sets it as a tag for the image. It also sets the `latest` tag on the image.

### container_deployment

Deploys the latest published image to Render using the same deploy action used in the repository-based deployment. The wait action is not used as it doesn't currently support image-based deployments.


## Tests

The project contains integration tests and end-to-end tests. All tests are currently located in the backend, but E2E tests test the frontend as well.

### Integration tests

There are integration tests for REST API Endpoints and WebSocket events.

These tests use the [Jest](https://jestjs.io/)-library for tests.
REST API endpoints are tested with [Supertest](https://github.com/ladjs/supertest#readme).
[Socket.io](https://socket.io/) events are tested with multiple client sockets in the backend. These tests make sure that messages are received in correct form and are sent to the correct users.

### End-to-End tests

E2E tests are done using [Cypress](https://docs.cypress.io/)
E2E tests are run when the whole application is running.
Cypress opens a browser and tests the application more like a user would. All essential actions are tested.

E2E tests are important for the CI/CD pipeline. Finishing these tests successfully means that the application works as a whole, even when built in a different environment.

## Backend

### User management

Backend runs an express server with `/api/users` and `/api/login` endpoints. Users can be created and single users can be fetched with id. Passwords are hashed before storage. Login returns a [JsonWebToken](https://jwt.io/) that can be used for authentication in following requests.

## Databases

### PostgreSQL

Users and private messages are stored in a [PostgreSQL](https://www.postgresql.org/) database through [TypeORM](https://typeorm.io/).

Database schema is updated with migrations. Migrations are generated with [TypeORM CLI](https://orkhan.gitbook.io/typeorm/docs/using-cli). Migrations run at server startup or manually. Tests also run migrations, so broken migrations won't get through the CI/CD pipeline.

### Redis

Global messages and server events (such as user joined) are stored in a [Redis](https://redis.io/) database. Redis is a key-value database that stores data in-memory (by default) so everything can be accessed fast and easily. Data stored in-memory also disappears when the server is closed.

Global messages and events are not using complex relations, and there is no need to store them persistently. On the contrary, I would prefer to store them for only about an hour to not bloat the front page or the database. I thought this would be a great chance to learn more about Redis.

Messages and events are stored in a list structure. Unfortunately, each list element can't be assigned it's own [TTL](https://redis.io/commands/ttl/) (Time-To-Live), so the whole list is cleared after an hour of no new updates. This is fine when there is not an around-the-clock active user base, but should find a better option for larger scale. Each message could be stored as it's own key (and TTL), but the speed and efficiency of this should be tested more.

### Encryption

Private messages are stored to database so they can be restored after a page refresh or logging back in.
To keep private messages actually private, message contents are encrypted with an AES-256 encryption before storage. Column encryption is done using [typeorm-encrypted](https://www.npmjs.com/package/typeorm-encrypted).

This prevents reading plain text messages from the database. Server-side SECRET environment variable (hashed with SHA-256) is needed to decrypt the message.

### Migration from Sequelize to TypeORM

Backend was using [Sequelize](https://sequelize.org/) as an ORM up to version 0.0.8.
I made the decision to migrate to TypeORM because of Sequelize's poor TypeScript support.

Sequelize supports TypeScript, but the types have to be added manually and are separate from the actual Sequelize model. [See Sequelize documentation for an example](https://sequelize.org/docs/v6/other-topics/typescript/#usage). This negates the point of using types, as developer can set the types invalidly as they become really complex with relations.

A great benefit of TypeORM is that migrations can be generated automatically. Generated migrations also consist of pure [SQL](https://en.wikipedia.org/wiki/SQL) scripts instead of being fully JavaScript/TypeScript. This let's the developer know exactly what the migrations are doing.

TypeORM is a great upgrade from Sequelize as it offers more control on migrations while automating type creation and actually writing the migrations.

To me personally, it feels like TypeORM abstracts more of the process, while giving the developer control on just the few things that matter, giving the developer a feeling of being in even more control.

## Frontend

Frontend is built with [React](https://react.dev/) and styled with [Material UI](https://mui.com/material-ui/).

[Redux](https://redux.js.org/) is used for state management. Client's state isn't too complicated so [React's Context API](https://react.dev/learn/passing-data-deeply-with-context) could have been used instead, but I was interested in learning more about Redux and at least it leaves room for scaling.

[Full-Duplex](https://techterms.com/definition/full-duplex) connection to server is created using [Socket.io](https://socket.io/). It primarily uses WebSockets to send messages both ways. All socket connections are authenticated with the JsonWebToken that is returned from the server on successful login. JWT is currently stored in [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is not needed even when running the client in development mode as Vite is configured to proxy these connections to server port and to change the origin. This works for both HTTP and WebSocket connections.

## Planned

- Render wait action for image deployment to CI pipeline
   - This requires an update for the action currently in use, or a new action
- Component tests to frontend
- Group chats to frontend
   - Functionality already exists on the server
- Full CRUD-actions to users in API

## Setup

### Environment

#### Node version

The build process requires a least Node version 15.x or higher because of some dependencies. Some dependencies warn that to get the optimal performance, at least version 18.x is needed.
It's good to note that these are dev dependencies and running the built application in production might be possible with a lower version of node.

The production version is running version 20.9.0.

### Backend

1. Change to `/server` directory
2. Run `npm install`
3. Create `.env` file with required env variables
   a. Check out `.env.template` for instructions or copy the contents of `.env.dev` that are configured to be used with `docker-compose.dev.yml`.
   b. This requires setting up PostgreSQL and Redis databases. This can be done easily with `docker-compose.dev.yml` in the root directory. This requires Docker.
   c. NOTE: Use separate databases and your own secret for production.
4. For the server to serve the client, client project needs to be built. Look for setup instructions below.
5. Now you can run the application with following commands:
   a. Run `npm run dev` for development with automatic reloading on save.
   b. Run `npm run build` and `npm start` to build and run for production.
   c. Run `npm test` for running tests
   d. Run `npm start:test` to start server with `test` mode (required for E2E tests)
   e. Run `npm test:e2e` to run End-to-End test while server is running in `test` mode. Run this in a separate terminal.

#### Database migrations

Database migrations are run automatically when running the server or tests.
Migrations can also be run manually to testing database with `npm run migration:run`.
Migrations can be generated with `npm run migration:generate --name=<migration name>`.
These migration commands both use the test database so it needs to be set up. (See instructions above and in .env.template).
Existing migrations also have to be run before generating new migrations.

### Frontend

1. Change to `/client` directory
2. Run `npm install`
3. Now you can run the application with following commands:
   a. Run `npm run dev` for development with hot reload. Server still needs to be running.
   b. Run `npm run build` to build static files. This needs to be done for the backend to start serving the client.

## Usage

### Backend

Express API endpoints:

These URLs work when running locally and port is left to default (3000)

```
Create user:
POST http://localhost:3000/api/users
REQUEST BODY { "username": "username", "password": "password"}

Get single user:
GET http://localhost:3000/api/users/:id

Login (get token):
POST http://localhost:3000/api/login
REQUEST BODY { "username": "username", "password": "password"}
```

### Frontend

Client can be accessed in the localhost port that is printed to console after running the application. e.g. http://localhost:3000.

When running frontend separately in dev mode, client should be accessed in a separate URL that is printed to frontend dev server console.

When running only the server, client can be accessed at the root path of the server URL.

Users can be created on the login page and after logging in, user enters the chatroom automatically. Online users can be clicked to open a private chat with them.
