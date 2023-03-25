const commentsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const middle = require('../utils/middleware')
const logger = require('../utils/logger')

commentsRouter.get('/:id/comments', async (request, response) => {  
  const posts = await Comment.find({}).populate('blog', {title: 1})
  //console.log('this is msg in get / blogsrouter')
  
  if (posts) {
    response.json(posts)
  } else {
    response.status(404).end()
  }
})

commentsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  console.log(body, 'is body')
  //const user = await User.findById(request.user)
  //console.log('we are in post')
  
  //maybe add key-value for comments array, like how users have array for blogs
  
  const comment = new Comment({
      comment: body.comment
    })

  const addedCom = await comment.save()
  response.status(201).json(addedCom)
  
})

//keep this for ability to either like or edit comment
commentsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    _id: request.params.id,
    user: body.user,
  })
  
  //const updatedBlog = await blog.save()
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
  response.status(201).json(updatedBlog)
})

module.exports = commentsRouter