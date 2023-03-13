const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const config = require('../utils/config')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach( async() => {
  await mongoose.connect(config.MONGODB_URI)
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((diary) => diary.save())
  await Promise.all(promiseArray)
})

describe('tests that were written as practice through the course', () => {
  test('blog infos are returned as json.practice', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('there are two blogs.practice', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(2)
  })

  test('the second blog is about html.practice', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[1].title).toBe('HTML In Five Easy Steps')
  })

  test('all blogs are returned.practice', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs.practice', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map((response) => response.title)
    expect(title).toContain(
      'SMH My Head'
    )
  })

  test('a valid blog can be added.practice', async () => {
    const newBlog = {
      title: 'Close Encounters of the Third Kind',
      author: 'Roswell',
      url: 'aliensarereal.com',
      likes: 34
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    //const response = await api.get('/api/blogs')

    const title = blogsAtEnd.map((response) => response.title)

    expect(title).toHaveLength(helper.initialBlogs.length + 1)
    expect(title).toContain(
      'Close Encounters of the Third Kind'
    )
  })

  test('blog without title, author, and url is not added.practice', async () => {
    const newBlog = {
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog can be viewed.practice', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogToView)
  })

  test('a blogs info can be deleted.practice', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const title = blogsAtEnd.map((response) => response.content)
    expect(title).not.toContain(blogToDelete.title)
  })
})

describe('when there is initially one user in db practice', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

describe ('tests that are written for the exercise', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('verifies that the unique identifier is called id and not _id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]
    expect(blogToView.id).toBeDefined()
  })

  test('verifies that if likes missing from request, likes will default to zero', async () => {
    const newBlog = {
      title: 'The Biography of Smitty Werbermenjensson',
      author: 'Mr. Krabs',
      url: 'hewasnumberone.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    //console.log(newBlog, 'is newblog')
    //console.log(newBlog.likes, 'is likes')

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map((response) => response.likes)
    expect(likes).toHaveLength(helper.initialBlogs.length+1)
    expect(likes[likes.length-1]).toEqual(0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Sandy',
      url: 'treedome.wordpress.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Doctor Professor Patrick',
      author: 'See Title',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('a valid blog can be added and is verified to save correctly', async () => {
    const newBlog = {
      title: 'Close Encounters of the Third Kind',
      author: 'Roswell',
      url: 'aliensarereal.com',
      likes: 34,
      user: '640d06830c19f12cf03c95b0'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

    console.log(blogsAtEnd[blogsAtEnd.length-1], 'is blogs at end at last index')
    expect(blogsAtEnd[blogsAtEnd.length-1].title).toEqual(newBlog.title)
    expect(blogsAtEnd[blogsAtEnd.length-1].author).toEqual(newBlog.author)
    expect(blogsAtEnd[blogsAtEnd.length-1].url).toEqual(newBlog.url)
    expect(blogsAtEnd[blogsAtEnd.length-1].likes).toEqual(newBlog.likes)
  })

  test('a blogs info can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length-1)

    const title = blogsAtEnd.map((response) => response.title)
    expect(title).not.toContain(blogToDelete.title)
  })

  test('a blogs likes can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: 'SMH My Head',
      author: 'Jordan Maron',
      url: 'captainsparklez.com',
      likes: 4
    }

    await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedLikes = blogsAtEnd.map((response) => response.likes)
    expect(updatedLikes[updatedLikes.length-1]).toEqual(4)

    //this test can be modified to also check for updated title, author, and url
    //would only need to create an updatedTitle, updatedAuthor, etc
    //and expect the item in the last index to equal that value
  })

})

describe('tests that require user login', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('testing123', 10)
    const user = new User({ username: 'ajohnson', passwordHash })

    await user.save()
  })
  
  test('no non unique users created and correct error code and message shown', async () => {
    const usersAtStart = await helper.usersInDb()
    
    //this is an improper user because there is someone with that username already
    const newUser = {
      username: 'ajohnson',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  
  test('no invalid user created because of username length and correct error code and message shown', async () => {
    const usersAtStart = await helper.usersInDb()
    
    //this is an improper user because the username is too short
    const newUser = {
      username: 'ty',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Must be at least 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)  
  })
  
  test('no invalid user created because of password length and correct error code and message shown', async () => {
    const usersAtStart = await helper.usersInDb()
    
    //this is an improper user because the password is too short
    const newUser = {
      username: 'tyedyed',
      name: 'Matti Luukkainen',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Must be at least 3 characters')
    
    //getting 401
    //maybe because it goes wrong user/pass instead of not created
    //but why? am posting to users and not login

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  
  test('adding a blog fails with 401 if no token provided', async () => {
    //adding a blog is done to the site /api/blogs
    
   const newBlog = {
      title: "There Are Hot And Ready Single Sandwiches In Your Area!",
      author: "Not A Scam",
      url: "hotsinglesinyourarea.com",
      likes: 24
  }
    
    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content=Type', /application\/json/)
      
    expect(result.body.error).toContain('invalid token')
    
    //getting 400 bad request
  })

})


afterEach( async () => {
  await mongoose.connection.close()
})

afterAll( async () => {
  await mongoose.connection.close()
})