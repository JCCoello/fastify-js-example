# Coello API Fastify (JS) - README

## Summary

Welcome to the Coello API Fastify JS project! This is a streamlined and efficient REST API designed to demonstrate basic CRUD (Create, Read, Update, Delete) operations. The API enables seamless interaction with a game management server through common HTTP methods such as GET, POST, PATCH, and DELETE. Whether you're adding a new game, retrieving a list of games, updating game details, or deleting a game, this project showcases how to implement these fundamental operations with ease.


## Requirements
Recommended Node.js and npm versions:

* Node.js: 14.18.0 or higher
* npm: 6.x or higher

## Installation steps
(from inside the project's root):

`npm install`

## Usage

To start the server, use the following command:

`npm start`

By default the server will run on localhost at port 3000.



## Schema Overview


Basic description of the schema and functionality of the Coello API Fastify (JS) project:

The schema is defined in JSON format and includes the following main components:

- `name`: The name of the project.
- `version`: The version of the schema.
- `items`: An array of HTTP request items.
- `environments`: An array of environments (currently empty).

## Schema Collection
* [Bruno Collection](schemas/coello%20api%20fastify%20(JS).json) (Probably won't work)
* [Postman Collection](schemas/coello%20api%20fastify%20postman.json)

## Endpoints

### `/games` (GET) 
Get Games - Retrieves a list of games from the server.

- **Type**: `http`
- **Name**: `games`
- **Request**:
  - **URL**: `http: //localhost:3000/games`
  - **Method**: `GET`
  - **Headers**: None
  - **Body**: 
    - **Mode**: `none`
  - **Auth**: 
    - **Mode**: `none`
  - **Query**: 
    - **Name**: (empty)
    - **Value**: (empty)
    - **Enabled**: `true`



### `/games` (POST)
Add New Game - adds a new game based on a string

- **Type**: `http`
- **Name**: `new game`
- **Request**:
  - **URL**: `http: //localhost:3000/games`
  - **Method**: `POST`
  - **Headers**:
    - **Content-Type**: `application/json` (enabled)
  - **Body**: 
    - **Mode**: `json`
    - **JSON**: ` {"game": string}`
  - **Auth**: 
    - **Mode**: `none`



### `/games` (DELETE)
Delete Game  - deletes a game based on the sent name

- **Type**: `http`
- **Name**: `delete game`
- **Request**:
  - **URL**: `http: //localhost:3000/games`
  - **Method**: `DELETE`
  - **Headers**: None
  - **Body**: 
    - **Mode**: `json`
    - **JSON**: 
      `{"game": string}`
  - **Auth**: 
    - **Mode**: `none`


### `games/:newName`
Update Game - updates the name of a game 

- **Type**: `http`
- **Name**: `updateGame`
- **Request**:
  - **URL**: `http: //localhost:3000/games/:newName`
  - **Method**: `PATCH`
  - **Headers**:
    - **Content-Type**: `application/json` (enabled)
  - **Body**: 
    - **Mode**: `json`
    - **JSON**: `{"game": string}`
  - **Auth**: 
    - **Mode**: `none`

