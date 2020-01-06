# Avoquizdo

This is an easy game to resolve quizzes in family or in group.

## Parts

- **Server**: the backend of the game that interacts with the database and manage the websocket connections.
- **Manager**: the manager is the UI for manage the quizzes, create, update and delete of them could be done here.
- **Game**: the game! it has two parts, one for the game host (the one which start the game) and other part for the players.

## Start with docker-compose

Just run `docker-compose start` this will build the images and run them. It also runs a mongo database server.

- The REST service is listening on `http://localhost:8080`
- The Manager is listening on `http://localhost:8001`
- The Game is listening on `http://localhost:8000`
