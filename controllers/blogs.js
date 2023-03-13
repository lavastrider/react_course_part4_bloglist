const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



blogsRouter.get('/', async (request, response) => {
  const diaries = await Blog.find({}).populate('user', {username: 1, personName: 1})
  
  if (diaries) {
    response.json(diaries)
  } else {
    response.status(404).end()
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  }
  else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken, 'is decoded token')
  
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  //console.log(user, 'is user after find by id')

  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id
  })

  const addedBlog = await blog.save()
  user.blogs = user.blogs.concat(addedBlog._id)
  await user.save()
  
  response.json(addedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.patch('/:id', async (request, response, next) => {
  const body = request.body
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  
  const updatedBlog = await blog.save()
  await Blog.findByIdAndUpdate(request.params.id)
  response.status(201).json(updatedBlog)
})

module.exports = blogsRouter