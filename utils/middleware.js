const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {

  //middleware should take the token from auth header
  //and place in token field of request object
  
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    //console.log(request.get('authorization'), 'is request.authorization')
    request.token = authorization.replace('Bearer ', '')
    //console.log(request.token, 'is request token')
  }
  next()
}

const userExtractor = (request, response, next) => {
  //middleware takes token from request obj
  //finds user
  //place in user field of request obj
  
  const user = request.get('token')
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  //console.log('we are in user extract')

  if (!decodedToken.id) {
    return response.status(401).send({ error: 'token invalid' })
  } else {
    request.user = decodedToken.id
  }
  next()

}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}