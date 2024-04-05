import fastify  from "fastify";

const app = fastify()

// RESTful

app.post('/events ', (request, reply) => {
    console.log(request.body)
    return 'Olá Imperador você está em casa!'
})

app.listen({port: 3333}).then(() => {
    console.log('HTTP server running!')
})