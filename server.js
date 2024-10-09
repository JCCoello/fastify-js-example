// ESM
import Fastify from 'fastify'

const fastify = Fastify({
    logger: true
})

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    // Server is now listening on ${address}
})

let games = [];

fastify.get('/games', (request, reply) => {
    reply.send(games)
})

fastify.post('/games', async (request, reply) => {
    const game = request.body.game;
    games.push(game);
    reply.send(games)
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
    reply.send({ "status": "ok", "naemName": newName, "oldName": game })
})
