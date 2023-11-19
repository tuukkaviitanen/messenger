# Messenger application

<b>IN PROGRESS</b>

Full Stack application using Node backend and React frontend.

Project is built with TypeScript.
[Zod](https://zod.dev/)-library is used to validate all inbound data at runtime as TypeScript types exist only until it is compiled into JavaScript. ESLint is used to enforce coding-style and format. Both frontend and backend ESLint setups are based on [XO](https://github.com/xojs/xo) rule set.

## CI/CD

There is a Github Actions build workflow in place to lint, test & build the code. Everything is tested in pull requests so broken code doesn't get into main branch.

Backend integration testing requires a test database, so the build pipeline runs a PostgreSQL Docker container as a service that is used in the pipeline tests. This guarantees that there aren't any external dependencies that would fail the tests (in this case, losing connection to remote test database)

## Backend

### User management

Backend runs an express server with `/api/users` and `/api/login` endpoints. Users can be created and single users can be fetched with id. Login returns a JsonWebToken that can be used for authentication in following requests.

Users are stored in a [PostgreSQL](https://www.postgresql.org/) server through [Sequelize](https://sequelize.org/). Passwords are hashed and usernames are unique.

### Tests

There are integration tests for all endpoints using [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest#readme). These tests are using a separate testing database.

There are also WebSocket tests for Socket.io connection and End-to-End tests using [Cypress](https://docs.cypress.io/). Everything is run in the CI pipeline. E2E tests use a testing endpoint `/api/testing/clearDatabase` to reset the database. The testing endpoint is only available in test environment.


## Frontend

Frontend is built with [React](https://react.dev/) and styled with [Material UI](https://mui.com/material-ui/).

[Redux](https://redux.js.org/) is used for state management. Client's state isn't too complicated so React's useContext API could have been used instead, but I was interested in learning more about Redux and at least it leaves room for scaling.

Full-Duplex connection to server is created using Socket.io. It primarily uses WebSockets to send messages both ways.

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is not needed even when running the client in development mode as Vite is configured to proxy these connections to server port and to change the origin. This works for both HTTP- and WebSocket connections.


# Planned

- Deploying application to [Render](https://render.com/) (integrated to CI/CD pipeline)
- Private messages and group chats to chat client
- Full CRUD-actions to users in API
- Containerizing the whole application using [Docker](https://www.docker.com/)

## Setup

### Environment

###### Node 18.x

The build process requires a least Node version 15.x or higher because of some dependencies. Some dependencies warn that to get the optimal performance, at least version 18.x is needed.
It's good to note that these are dev dependencies and running the built application in production might be possible with a lower version of node.

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
