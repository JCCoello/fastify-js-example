# Coello API Fastify (JS) - README

## Summary

The Coello API Fastify JS project is an advanced and efficient REST API designed to facilitate basic CRUD (Create, Read, Update, Delete) operations within a game management system. Leveraging the Fastify framework for its high performance and SQLite for data persistence, this project allows for easy manipulation of game entries through standard HTTP methods such as GET, POST, PATCH, and DELETE. This documentation provides a comprehensive guide to installing, configuring, and utilizing the API to manage a collection of games.

## Requirements

To ensure a smooth operation of the Coello API, the following software versions are recommended:

- Node.js: 14.18.0 or higher
- npm: 6.x or higher

## Installation Steps

Follow these steps to set up the project environment:

1. Clone the repository or download the source code to your local machine.
2. Navigate to the project's root directory.
3. Run `npm install` to install all necessary dependencies.

## Usage

To launch the server, execute:

`npm start`

By default, the server operates on localhost at port 3000.

## Database Initialization

Upon starting the server for the first time, the SQLite database (`games.db`) will be automatically created in the root directory of the project. The database initialization process includes the creation of a `game` table and the insertion of default game entries if the table is empty.

## Endpoints Overview

The Coello API supports several endpoints for managing game entries:

### GET `/games`

- Retrieves a list of all games in the database.
- **Request**: No body required.
- **Response**: An array of game objects.

### POST `/games`

- Adds a new game to the database.
- **Request Body**: `{"name": "Game Name"}`
- **Response**: The ID of the newly inserted game.

### PATCH `/games/:id`

- Updates the name of an existing game by ID.
- **Request Body**: `{"name": "New Game Name"}`
- **Response**: Confirmation message with the updated game details.

### DELETE `/games/:id`

- Deletes a game from the database by ID.
- **Request**: No body required.
- **Response**: Confirmation message indicating successful deletion.

### GET `/search`

- Searches for a game by name.
- **Query Parameter**: `game` (the name of the game to search for)
- **Response**: Game object if found; otherwise, a message indicating the game does not exist.

## Schema Overview

The `game` table schema consists of:

- `id`: INTEGER PRIMARY KEY AUTOINCREMENT - A unique identifier for each game entry.
- `name`: TEXT NOT NULL - The name of the game.

## Closing the Database Connection

The database connection is gracefully closed when the Fastify server instance is shut down, ensuring no database locks or leaks occur.

## Examples

Here are some example requests to get you started:

- **List Games**: `GET http://localhost:3000/games`
- **Add Game**: `POST http://localhost:3000/games` with body `{"name": "Zelda"}`
- **Update Game**: `PATCH http://localhost:3000/games/1` with body `{"name": "Super Zelda"}`
- **Delete Game**: `DELETE http://localhost:3000/games/1`

For a more detailed exploration of the API's capabilities, consider using Postman or a similar API testing tool to interact with the endpoints.

## Conclusion

The Coello API Fastify JS project demonstrates a practical implementation of a RESTful API using the Fastify framework and SQLite. It is designed to be a starting point for developers looking to build or extend their own APIs with similar functionality.