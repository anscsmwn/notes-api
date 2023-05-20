const Hapi = require('@hapi/hapi')
const routes = require('./routes')

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  // Define your routes here...
  server.route(routes)

  // Route not found handler
  const notFoundHandler = (request, h) => {
    const response = h.response({
      statusCode: 404,
      error: 'Not Found',
      message: 'The requested resource was not found on this server.',
    })
    response.code(404)
    return response
  }

  // Set the route not found handler
  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response.isBoom && response.output.statusCode === 404) {
      return notFoundHandler(request, h)
    }

    return h.continue
  })

  try {
    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`)
  } catch (err) {
    console.error('Error starting server:', err)
  }
}

init()
