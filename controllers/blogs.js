const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middle = require('../utils/middleware')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const diaries = await Blog.find({}).populate('user', {username: 1, personName: 1})
  //console.log('this is msg in get / blogsrouter')
  
  if (diaries) {
    response.json(diaries)
  } else {
    response.status(404).end()
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  //console.log(request.params, 'is request params')
  //console.log(request.params.id, 'is request params id which should be same id as in url')
  
  if (blog) {
    response.json(blog)
  }
  else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middle.userExtractor, async (request, response) => {
  const body = request.body
  const user = await User.findById(request.user)
  //console.log('we are in post')
  
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
	
blogsRouter.delete('/:id', middle.userExtractor, async (request, response, next) => {
  //blog can only be deleted by user who added the blog
  //aka only possible if request.token is same as blog's creator

  const user = await User.findById(request.user)
  //console.log(user, 'is user')
  const userID = user.id.toString()
  //console.log(userID, 'is userID')

  //blog that the url points to, which is the one that is to be deleted
  const blogToDelete = await Blog.findById(request.params.id)
  //console.log(blogToDelete, 'is blog to delete')

  //if user.id equals user.id in blog with id of id
  if (blogToDelete.user.toString() === userID) {
    //the userID from token is the same as the user id in the blog
    //console.log('we are gonna delete the blog')
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'User does not have permission to perform this action' })
  }

  //if attempted without token or by invalid user, return 401
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    _id: request.params.id,
    user: body.user
  })
  
  //const updatedBlog = await blog.save()
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
  response.status(201).json(updatedBlog)
})

module.exports = blogsRouter
