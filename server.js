
const path = require("path");

const fastify = require("fastify")({
    logger: false,
});

const cors = require('@fastify/cors')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

fastify.register(cors, {
    origin: true, // Allow all origins
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
})

fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
    prefix: "/", // optional: default '/'
});

fastify.get('/api/webradios/:subpath', async (request, reply) => {
    try {
        const { subpath } = request.params;
        const apiUrl = `https://www.radiofrance.fr/fip/api/live/webradios/${subpath}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
});



// Run the server and report out to the logs
fastify.listen(
    { port: process.env.PORT, host: "0.0.0.0" },
    function (err, address) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`webradio API is listening on ${address}`);
    }
);
