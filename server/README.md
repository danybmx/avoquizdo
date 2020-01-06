# Avoquizdo - Server

This project is the server for Avoquizdo, it is in charge of manage websocket connections to host and players and
also store/retrieve quizzes and data for the database.

## Dependencies

A mongo database server.

## How to use

1. Run `npm install` to install all dependencies.
2. Run `npm run start` for start the project.
3. You could use the REST API on `http://localhost:8080`.

## Available endpoints for manage Quiz resource

- GET /quizzes
- GET /quizzes/{id}
- POST /quizzes
- PUT /quizzes
- DELETE /quizzes/{id}

## How to test

TBD - Just run `npm run test`

## How to deploy

Run `npm run build` and copy the `dist` folder contents to a server which serves static content.
