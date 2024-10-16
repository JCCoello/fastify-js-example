# Coello API Fastify (JS) - README

## Summary

The Coello API Fastify JS project is a REST API designed for facilitating CRUD (Create, Read, Update, Delete) operations within a game management system. It utilizes the Fastify framework for high performance and SQLite for data persistence, enabling manipulation of game entries through standard HTTP methods such as GET, POST, PATCH, and DELETE. This documentation provides a comprehensive guide on installing, configuring, and utilizing the API to manage a collection of games, including features for filtering game listings based on various attributes.

## Requirements

For smooth operation of the Coello API, the following software versions are recommended:

- Node.js: 14.18.0 or higher
- npm: 6.x or higher

## Installation Steps

To set up the project environment, follow these steps:

1. Clone the repository or download the source code to your local machine.
2. Navigate to the project's root directory.
3. Run `npm install` to install all necessary dependencies.

## Usage

To launch the server, execute:

`npm start`

The server operates on localhost at port 3000 by default.

## Database Initialization

The SQLite database (`games.db`) is automatically created in the project's root directory upon the server's first start. The database initialization process includes creating a `game` table with fields for `id`, `name`, `category`, `year`, and `rating`, and inserting default game entries if the table is empty.

## Endpoints Overview

The Coello API supports several endpoints for managing game entries, with the ability to filter games by category, year, and rating:

### GET `/games`

- Retrieves a list of all games in the database, with optional filters.
- **Request Parameters**: `category`, `year`, `rating`
- **Response**: An array of game objects.

### POST `/games`

- Adds a new game to the database.
- **Request Body**: `{"name": "Game Name", "category": "Category", "year": Year, "rating": "Rating"}`
- **Response**: The ID of the newly inserted game.

### PATCH `/games/:id`

- Updates the details of an existing game by ID.
- **Request Body**: Fields to update, e.g., `{"name": "New Game Name", "category": "New Category"}`
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

The `game` table schema includes:

- `id`: INTEGER PRIMARY KEY AUTOINCREMENT - A unique identifier for each game entry.
- `name`: TEXT NOT NULL - The name of the game.
- `category`: TEXT - The category of the game.
- `year`: INTEGER - The release year of the game.
- `rating`: TEXT - The rating of the game.

## Closing the Database Connection

The database connection is gracefully closed when the Fastify server instance is shut down, ensuring no database locks or leaks occur.

## Examples

Here are some example requests to get you started:

- **List Games with Filters**: `GET http://localhost:3000/games?category=Adventure&year=2020`
- **Add Game**: `POST http://localhost:3000/games` with body `{"name": "Zelda", "category": "Adventure", "year": 1986, "rating": "E"}`
- **Update Game**: `PATCH http://localhost:3000/games/1` with body `{"name": "Super Zelda", "rating": "T"}`
- **Delete Game**: `DELETE http://localhost:3000/games/1`

For a more detailed exploration of the API's capabilities, consider using Postman or a similar API testing tool to interact with the endpoints.

## Conclusion

The Coello API Fastify JS project provides a practical implementation of a RESTful API using the Fastify framework and SQLite. It offers a robust solution for developers looking to build or extend their own APIs with comprehensive game catalog management capabilities.