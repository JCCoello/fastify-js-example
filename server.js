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
    db.all("SELECT * FROM game", [], (err, rows) => {
        if (err) {
            reply.send(err);
            return;
        }
        reply.send(rows);
    });
})

fastify.post('/games', async (request, reply) => {
    const { name } = request.body;

    const insertGame = new Promise((resolve, reject) => {
        db.run("INSERT INTO game (name) VALUES (?)", [name], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });

    try {
        const lastID = await insertGame;
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
    const { name } = request.body;

    // Use a parameterized SQL query to prevent SQL injection and ensure safe updates
    db.run("UPDATE game SET name = ? WHERE id = ?", [name, id], function (err) {
        if (err) {
            request.log.error(err);
            reply.status(500).send({ error: 'An error occurred while updating the game.' });
            return;
        }
        if (this.changes === 0) {
            // No rows were updated, which means the game with the specified ID was not found
            reply.status(404).send({ message: 'Game not found.' });
        } else {
            // Successfully updated the game
            reply.send({ message: 'Game successfully updated.', id, name });
        }
    });
});