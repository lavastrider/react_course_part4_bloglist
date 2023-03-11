const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "SMH My Head",
    author: "Jordan Maron",
    url: "captainsparklez.com",
    likes: 2
  },
  {
    title: "HTML In Five Easy Steps",
    author: "Steve Jobs",
    url: "apple.com",
    likes: 4
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovesoon", author: "me", url: "goodbye.com" })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blogInfo => blogInfo.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb
}