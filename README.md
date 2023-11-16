# Messenger application

<b>IN PROGRESS</b>

Full Stack application using Node backend and React frontend.

Project is built with TypeScript.
[Zod-library](https://zod.dev/) is used to validate all inbound data at runtime as TypeScript types exist only until it is compiled into JavaScript.

## CI/CD

There is a Github Actions build workflow in place to lint, test & build the code. Everything is tested in pull requests so broken code doesn't get into main branch.

Backend integration testing requires a test database, so the build pipeline runs a PostgreSQL Docker container as a service that is used in the pipeline tests. This guarantees that there aren't any external dependencies that would fail the tests (in this case, losing connection to remote test database)

## Backend

### User management

Backend runs an express server with `/api/users` and `/api/login` endpoints. Users can be created and single users can be fetched with id. Login returns a JsonWebToken that can be used for authentication in following requests.

Users are stored in a [PostgreSQL](https://www.postgresql.org/) server through [Sequelize](https://sequelize.org/). Passwords are hashed and usernames are unique.

There are integration tests for all endpoints. These tests are using a separate testing database.

# Planned

- Frontend with React
  - Styling with [Material UI](https://mui.com/material-ui/)
- Full-Duplex connection between frontend and backend using [Socket.io](https://socket.io/)
  - This will enable messaging with other users through server
- Deploying application to [Render](https://render.com/) (integrated to CI/CD pipeline)
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
4. Now you can run the application with following commands:
  a. Run `npm run dev` for development with automatic reloading on save.
  b. Run `npm run build` and `npm start` to build and run for production
  c. Run `npm test` for running tests

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

