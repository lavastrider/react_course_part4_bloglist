require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? 'mongodb+srv://magically:marvelous@blogs.kxctwgf.mongodb.net/testBlog?retryWrites=true&w=majority'
  : "mongodb+srv://magically:marvelous@blogs.kxctwgf.mongodb.net/?retryWrites=true&w=majority"

module.exports = {
  MONGODB_URI,
  PORT
}