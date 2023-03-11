const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const blogTitle = process.argv[3]
const blogAuthor = process.argv[4]
const blogURL = process.argv[5]

const url = `mongodb+srv://magically:${password}@blogs.kxctwgf.mongodb.net/?retryWrites=true&w=majority`
//const url = `mongodb+srv://magically:${password}@blogs.kxctwgf.mongodb.net/testBlog?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDb', error.message)
  })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

//console.log(testing, 'is testing')

const Blog = mongoose.model('Blog', blogSchema)

const blogEntry = new Blog({
  title: blogTitle,
  author: blogAuthor,
  url: blogURL,
  likes: 0
})

//name.save().then(result => {
//  console.log('name saved!')
//  mongoose.connection.close()
//})

if (process.argv.length === 3) {
  console.log('list of blogs:')
  Blog.find({}).then(result => {
    result.forEach(notebook => {
      console.log(`${notebook.title} ${notebook.author} ${notebook.url} ${notebook.likes}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 4 || process.argv.length === 5) {
  console.log('we are missing full new entry')
  process.exit(1)
}

if (process.argv.length === 6) {
  console.log(blogTitle, 'is blog title')
  console.log(blogAuthor, 'is blog author')
  console.log(blogURL, 'is blog url')
  blogEntry.save().then(result => {
    console.log(result, 'is result in save')
    console.log(`The blog ${blogTitle} was added to the list of blogs`)
    mongoose.connection.close()
  })
}