const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

//at http://localhost:3003/api/login

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
    
  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'invalid username or password' })
  }
  
  const userForToken = {
    username: user.username,
    id: user._id
  }
  
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*100 }
  )
  
  response
    .status(200)
    .send({ token, username: user.username, personName: user.personName })
})

module.exports = loginRouter