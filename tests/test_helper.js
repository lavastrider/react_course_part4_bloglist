const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'SMH My Head',
    author: 'Jordan Maron',
    url: 'captainsparklez.com',
    likes: 2,
    user: '640ff8fd772f7102bbf3bed5'
  },
  {
    title: 'HTML In Five Easy Steps',
    author: 'Steve Jobs',
    url: 'apple.com',
    likes: 4
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovesoon', author: 'me', url: 'goodbye.com' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blogInfo => blogInfo.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((ident) => ident.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}