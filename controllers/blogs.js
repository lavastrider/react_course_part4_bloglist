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
  //console.log(request.params, 'is request params')
  //console.log(request.params.id, 'is request params id which should be same id as in url')
  
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
  //blog can only be deleted by user who added the blog
  //aka only possible if request.token is same as blog's creator

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  //console.log(decodedToken, 'is decoded token')
  //console.log(decodedToken.id, 'is decoded token id')


  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  //console.log(user, 'is user')
  const userID = user._id.toString()
  //console.log(userID, 'is userID')
  
  const placeholderDueToPostmanIssue = '640d13e5ebcb7a2bb117dce6'

  //blog that the url points to, which is the one that is to be deleted
  //const blogToDelete = await Blog.findById(request.params.id)
  const blogToDelete = await Blog.findById(placeholderDueToPostmanIssue)
  console.log(blogToDelete, 'is blog to delete')
  //console.log(request.params, 'is request params')
  //console.log(request.params.id, 'is request params id which should be same id as in url')

  //if user.id equals user.id in blog with id of id
  if (blogToDelete.user.toString() === userID) {
    //the userID from token is the same as the user id in the blog
    console.log('we are gonna delete the blog')
    //await Blog.findByIdAndRemove(request.params.id)
    await Blog.findByIdAndRemove(placeholderDueToPostmanIssue)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'User does not have permission to perform this action' })
  }

  //if attempted without token or by invalid user, return 401
})

blogsRouter.delete('/:id', async (request, response, next) => {
  //blog can only be deleted by user who added the blog
  //aka only possible if request.token is same as blog's creator
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
  
  //if attempted without token or by invalid user, return 401
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
