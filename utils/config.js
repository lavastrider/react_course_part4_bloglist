require('dotenv').config()

const PORT = 3003
const MONGODB_URI = 'mongodb+srv://magically:marvelous@blogs.kxctwgf.mongodb.net/?retryWrites=true&w=majority'

module.exports = {
  MONGODB_URI,
  PORT
}