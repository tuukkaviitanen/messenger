# Messenger application

> Full Stack chat application using Node backend and React frontend.

<b>IN PROGRESS</b>

LIVE ON RENDER: https://messenger-app-3ztg.onrender.com.
Running as a free tier service so it might take some time to start up.

## Summary

Node server has a REST API using [Express](https://expressjs.com/) and WebSockets server using Socket.io.

Users are validated and stored in a PostgreSQL database.

REST API is used for user management and websockets are used to transport messages between users real-time.

Project is built with TypeScript.
[Zod](https://zod.dev/)-library is used to validate all inbound data at runtime as TypeScript types exist only until it is compiled into JavaScript. ESLint is used to enforce coding-style and format. Both frontend and backend ESLint setups are based on [XO](https://github.com/xojs/xo) rule set.


## CI/CD

There is a Github Actions build workflow in place to lint, test & build the code. Everything is tested in pull requests so broken code doesn't get into main branch.

The the CI pipeline consist of 3 jobs: 

### build

Checkouts the code, installs dependecies, runs eslint, builds projects, runs tests (integration tests and end-to-end tests).

Backend integration testing requires a test database, so the build pipeline runs a PostgreSQL Docker container as a service that is used in the pipeline tests. This guarantees that there aren't any external dependencies that would fail the tests (in this case, losing connection to remote test database)

Build job is actually done 3 times concurrently. Each with a different node version: 16.x, 18.x and 20.x. Running different versions is redundant and it could be reduced to only run 20.x as that is currently run on production. But in a project this size, it doesn't affect the build length that much so I think it's nice to be alerted if there are version specific problems.

### tag_release

If build is successful, runs [github-tag-action](https://github.com/anothrNick/github-tag-action) that bumps the tag version of the repository. By default it bumps up the patch version but minor version and major version can also be bumped by adding #major or #minor to commit message.

### deployment

If build and tagging are successful, deploys the main branch to [Render](https://render.com/) using [render-deploy-action](https://github.com/johnbeynon/render-deploy-action).
After initializing the deployment, waits for deployment to finish successfully using [render-action](https://github.com/Bounceapp/render-action).


## Tests

The project contains integration tests and end-to-end tests. All tests are currently located in the backend, but E2E tests test the frontend as well.

### Integration tests

There are integration tests for REST API Endpoints and WebSocket events. 

These tests use the [Jest](https://jestjs.io/)-library for tests. 
REST API endpoints are tested with [Supertest](https://github.com/ladjs/supertest#readme). 
Socket.io events are tested with Socket.io client in the backend.

### End-to-End tests

E2E tests are done using [Cypress](https://docs.cypress.io/)
E2E tests are run when the whole application is running. 
Cypress opens a browser and tests the application more like a user would. All essential actions are tested. 

E2E tests are important for the CI/CD pipeline. Finishing these tests successfully means that the application works as a whole, even when built in a different environment. 


## Backend

### User management

Backend runs an express server with `/api/users` and `/api/login` endpoints. Users can be created and single users can be fetched with id. Login returns a JsonWebToken that can be used for authentication in following requests.

Users are stored in a [PostgreSQL](https://www.postgresql.org/) server through [Sequelize](https://sequelize.org/). Passwords are hashed and usernames are unique.


## Frontend

Frontend is built with [React](https://react.dev/) and styled with [Material UI](https://mui.com/material-ui/).

[Redux](https://redux.js.org/) is used for state management. Client's state isn't too complicated so React's Context API could have been used instead, but I was interested in learning more about Redux and at least it leaves room for scaling.

Full-Duplex connection to server is created using Socket.io. It primarily uses WebSockets to send messages both ways. All websocket connections are authenticated with the JsonWebToken that is returned from the server on successful login. JWT is currently stored in localstorage.

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is not needed even when running the client in development mode as Vite is configured to proxy these connections to server port and to change the origin. This works for both HTTP- and WebSocket connections.


# Planned

- Private messages and group chats to chat client
- Full CRUD-actions to users in API
- Containerizing the whole application using [Docker](https://www.docker.com/)
- Component tests to frontend

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
  a. Check out `.env.template` for reference
  b. This requires setting up a PostgreSQL database. You can use easily set up a docker container with instructions [here](https://stackoverflow.com/questions/37694987/connecting-to-postgresql-in-a-docker-container-from-outside) (this of course requires setting up Docker first)
3. For the server to serve the client, client project needs to be built. Look for setup instructions below.
4. Now you can run the application with following commands:
  a. Run `npm run dev` for development with automatic reloading on save.
  b. Run `npm run build` and `npm start` to build and run for production.
  c. Run `npm test` for running tests
  d. Run `npm start:test` to start server with `test` mode (required for E2E tests)
  e. Run `npm test:e2e` to run End-to-End test while server is running in `test` mode

### Frontend

1. Change to `/client` directory
2. Run `npm install`
4. Now you can run the application with following commands:
  a. Run `npm run dev` for development with hot reload. Server still needs to be running.
  b. Run `npm run build` to build static files. This needs to be done for the backend to start serving the client.


## Usage

### Backend

Endpoints:

These URLs work when running locally and port is left to default (3000)
```
Create user:
POST http://localhost:3000/api/users
REQUEST BODY { "username": "username", "password": "password"}

Get single user:
GET http://localhost:3000/api/users/:id

Login (get JTW):
POST http://localhost:3000/api/login
REQUEST BODY { "username": "username", "password": "password"}
```

### Frontend

Client can be accessed in the localhost port that is printed to console after running the application. e.g. http://localhost:3000.

When running frontend separately in dev mode, client should be accessed in a separate URL that is printed to frontend console.

When running only the server, client can be accessed at the root path of the server URL.

Users can be created on the login page and after logging in, user enters the chatroom automatically.
