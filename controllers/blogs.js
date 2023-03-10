const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
	Blog.find({})
		.then((diaries) => {
			response.json(diaries)
		})
})

//blogsRouter.get('/api/blogs/:id', (request, response, next) => {
//	Blog.findById(request.params.id)
//		.then((book) => {
//			if (book) {
//				response.json(book)
//			} else {
//				response.status(404).end()
//			}
//		})
//		.catch(error => next(error))
//})

blogsRouter.post('/', (request, response, next) => {
	const body = request.body
	
	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: 0
	})
	
	blog.save()
		.then((addedBlog) => {
			response.status(201).json(addedBlog)
		})
		.catch(error => next(error))
})

//blogRouter.delete('/api/blogs/:id', (request, response, next) => {
//	Blog.findByIdAndRemove(request.params.id)
//		.then(() => {
//			response.status(204).end()
//		})
//		.catch(error => next(error))
//	})

//blogRouter.put('/api/blogs

module.exports = blogsRouter