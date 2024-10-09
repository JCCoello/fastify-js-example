// ESM
import Fastify from 'fastify'

const fastify = Fastify({
    logger: true
})

// Add this to the top of your server.js file
import { sqlite3 } from 'fastify-sqlite';
const db = new sqlite3.Database('./games.db');


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
    db.run("INSERT INTO game (name) VALUES (?)", [name], function (err) {
        if (err) {
            console.log("ERRR")
            reply.send(err);
            return;
        }
        reply.send({ id: this.lastID, name });
    });
})

fastify.delete('/games', async (request, reply) => {
    games = games.filter(game => game !== request.body.game);
    reply.send(games)
})

fastify.get('/search', async (request, reply) => {
    const gamename = request.query.game;
    const gameInLibrary = games.some(game => game === gamename)
    reply.send({ "result": `game called ' ${gamename}' exists in library: ${gameInLibrary}` })
})

fastify.patch('/games/:gameId', async (request, reply) => {
    const game = request.params.gameId;
    const newName = request.body.newName;
    reply.send({ "status": "ok", "newName": newName, "oldName": game })
})
