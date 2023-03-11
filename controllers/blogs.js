const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const diaries = await Blog.find({})
  
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

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = await User.findById(body.userId)
  
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
  response.status(201).json(addedBlog)
  
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