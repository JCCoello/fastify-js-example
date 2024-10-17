// ESM
import Fastify from 'fastify'

const fastify = Fastify({
    logger: true
})

// Add this to the top of your server.js file
import { sqlite3 } from 'fastify-sqlite';

const db = new sqlite3.Database('./games.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database opened successfully');
    }
});

// Define a function to initialize the database
function initializeDb() {
    db.serialize(() => {
        // Create the table with autoincrement for the id
        db.run(`CREATE TABLE IF NOT EXISTS game (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err);
                return;
            }

            const addColumns = [
                `ALTER TABLE game ADD COLUMN category TEXT`,
                `ALTER TABLE game ADD COLUMN year INTEGER`,
                `ALTER TABLE game ADD COLUMN rating TEXT`
            ];

            addColumns.forEach((query) => {
                db.run(query, (err) => {
                    if (err) {
                        console.log('Attempted to add an existing column or other error:', err.message);
                    }
                });
            });

            // Check if the table is empty
            db.get("SELECT COUNT(id) as count FROM game", (err, row) => {
                if (err) {
                    console.error('Error checking table data', err);
                    return;
                }
                // If the table is empty, insert default entries
                if (row.count === 0) {
                    const games = ['Mario Bros 1', 'Tetris', 'Sonic the Hedgehog'];
                    const placeholders = games.map(() => '(?)').join(',');
                    const sql = `INSERT INTO game (name) VALUES ${placeholders}`;

                    db.run(sql, games, function (err) {
                        if (err) {
                            console.error('Error inserting default games', err);
                            return;
                        }
                        console.log(`${this.changes} rows inserted`);
                    });
                }
            });
        });
    });
}

// Initialize the database and insert default entries if needed
initializeDb();


// Make sure to close the database connection when you're done
fastify.addHook('onClose', (instance, done) => {
    db.close();
    done();
});

// Run the server!
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log(`Server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    // Server is now listening on ${address}
})

fastify.get('/games', (request, reply) => {
    const { category, year, rating } = request.query;

    let sql = "SELECT * FROM game WHERE 1=1";
    let params = [];

    // Dynamically add filters to the SQL query if they are present
    if (category) {
        sql += " AND category = ?";
        params.push(category);
    }
    if (year) {
        sql += " AND year = ?";
        params.push(year);
    }
    if (rating) {
        sql += " AND rating = ?";
        params.push(rating);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            reply.send(err);
            return;
        }
        reply.send(rows);
    });
})


fastify.get('/games/:id', async (request, reply) => {
    const { id } = request.params;

    try {
        const row = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM game WHERE id = ?", [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (row) {
            reply.send(row);
        } else {
            return reply.status(404).send({ error: `Game with id ${id} doesn't exist` });
        }
    } catch (err) {
        request.log.error(err);
        // Use 'return' here to ensure the function exits after sending the error response
        return reply.status(500).send({ error: 'An error occurred during the search.' });
    }
});


fastify.post('/games', async (request, reply) => {
    // Destructure all possible fields from request.body
    const { name, category, year, rating } = request.body;

    // Initialize SQL query parts
    let fields = "name";
    let placeholders = "?";
    let values = [name];

    // Dynamically add fields if they are provided
    if (category !== undefined) {
        fields += ", category";
        placeholders += ", ?";
        values.push(category);
    }
    if (year !== undefined) {
        fields += ", year";
        placeholders += ", ?";
        values.push(year);
    }
    if (rating !== undefined) {
        fields += ", rating";
        placeholders += ", ?";
        values.push(rating);
    }

    // Construct the final SQL query string
    const sql = `INSERT INTO game (${fields}) VALUES (${placeholders})`;

    // Wrap the db.run call in a promise to use async/await
    const insertGame = new Promise((resolve, reject) => {
        db.run(sql, values, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });

    try {
        const lastID = await insertGame;
        // Assuming you want to return the inserted game's ID to the client
        reply.send({ message: "Game successfully inserted.", id: lastID });
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: "An error occurred while inserting the game." });
    }
});

fastify.delete('/games/:id', (request, reply) => {
    const { id } = request.params;

    db.run("DELETE FROM game WHERE id = ?", [id], function (err) {
        if (err) {
            request.log.error(err);
            reply.status(500).send({ error: 'An error occurred while deleting the game.' });
            return;
        }
        if (this.changes === 0) {
            reply.status(404).send({ message: 'Game not found.' });
        } else {
            reply.status(200).send({ message: `Game with id ${id} was deleted.` });
        }
    });
});

fastify.get('/search', async (request, reply) => {
    const gamename = request.query.game;

    try {
        // Wrap the database operation in a Promise to use with async/await
        const row = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM game WHERE name = ?", [gamename], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (row) {
            reply.send({ result: `Game called '${gamename}' exists in library: true`, game: row });
        } else {
            reply.send({ result: `Game called '${gamename}' exists in library: false` });
        }
    } catch (err) {
        request.log.error(err);
        // Use 'return' here to ensure the function exits after sending the error response
        return reply.status(500).send({ error: 'An error occurred during the search.' });
    }
});

fastify.patch('/games/:id', (request, reply) => {
    const { id } = request.params;
    const { name, category, year, rating } = request.body;

    // Initialize the SQL query without assuming any fields are present
    let sql = "UPDATE game SET";
    let params = [];
    let fieldsToUpdate = []; // Keep track of fields to update

    // Dynamically add fields to the SQL query if they are present in the request body
    if (name !== undefined) {
        fieldsToUpdate.push("name = ?");
        params.push(name);
    }
    if (category !== undefined) {
        fieldsToUpdate.push("category = ?");
        params.push(category);
    }
    if (year !== undefined) {
        fieldsToUpdate.push("year = ?");
        params.push(year);
    }
    if (rating !== undefined) {
        fieldsToUpdate.push("rating = ?");
        params.push(rating);
    }

    // Ensure there are fields to update, otherwise return an error
    if (fieldsToUpdate.length === 0) {
        reply.status(400).send({ error: 'No fields provided for update.' });
        return;
    }

    // Join the fields to update into the SQL query
    sql += " " + fieldsToUpdate.join(", ");

    // Add the WHERE clause to target the correct game by ID
    sql += " WHERE id = ?";
    params.push(id);

    // Use a parameterized SQL query to prevent SQL injection and ensure safe updates
    db.run(sql, params, function (err) {
        if (err) {
            request.log.error(err);
            reply.status(500).send({ error: 'An error occurred while updating the game.' });
            return;
        }
        if (this.changes === 0) {
            // No rows were updated, which means the game with the specified ID was not found
            reply.status(404).send({ message: 'Game not found.' });
        } else {
            // Successfully updated the game. Construct the response to include what was updated.
            let updatedFields = {};
            if (name !== undefined) updatedFields.name = name;
            if (category !== undefined) updatedFields.category = category;
            if (year !== undefined) updatedFields.year = year;
            if (rating !== undefined) updatedFields.rating = rating;

            reply.send({ message: 'Game successfully updated.', updatedFields });
        }
    });
});