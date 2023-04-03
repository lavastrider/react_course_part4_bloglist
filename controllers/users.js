const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    if (request.body.password.length >= 16) {
      const { username, personName, emailAddress, password } = request.body
  
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
  
      const user = new User({
        username,
        personName,
        emailAddress,
        passwordHash
      })
  
      const savedUser = await user.save()
      response.status(201).json(savedUser)    
    } else {
      response.status(400).json({ error: 'User validation failed: password: Must be at least 16 characters' })  
    
    } 
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1, likes: 1})
  response.json(users)
})

module.exports = usersRouter