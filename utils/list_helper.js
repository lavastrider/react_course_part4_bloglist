
const dummy = (blogs) => {
  //const blogArray = blogs

  return 1
}

const totalLikes = (blog) => {
  //console.log(blog)
  var sum = 0

  if (blog.length === 0) {
    return 0
  } else {
    sum = 0
    for (let i=0; i < blog.length; i++) {
      sum += blog[i].likes
    }
    return sum
  }
}

const favoriteBlog = (blogs) => {
  //receives list of blogs
  const blogHigh = {
    title: '',
    author: '',
    likes: 0
  }

  //go through blogs
  //if blogs[i].likes is greater than blogHigh.likes
  //blogHigh.likes = blogs[i].likes
  //blogHigh.title = blogs[i].title
  //blogHigh.author = blogs[i].author

  for (let i=0; i < blogs.length; i++) {
    if (blogs[i].likes > blogHigh.likes) {
      blogHigh.likes = blogs[i].likes
      blogHigh.title = blogs[i].title
      blogHigh.author = blogs[i].author
    }
  }

  return blogHigh
}

const mostBlogs = (blogs) => {
  //gets array of blogs

  const blogAuthArray = []

  //make array of author names
  //find mostFrequent of author names

  //create array of authors
  for (let i=0; i<blogs.length; i++) {
    blogAuthArray[i] = blogs[i].author
  }

  //find most frequent
  var highAmt = 1
  var highAuth = ''
  var currAmt = 0
  var currAuth = ''

  for (let i=0; i<blogAuthArray.length; i++) {
    for (let j=0; j<blogAuthArray.length; j++) {
      if (blogAuthArray[i] === blogAuthArray[j]) {
        currAmt+=1
        currAuth = blogAuthArray[i]
      }
      if (highAmt < currAmt) {
        highAmt = currAmt
        highAuth = currAuth
      }
    }
    currAmt = 0
  }

  const blogAuth = {
    author: highAuth,
    blogs: highAmt
  }

  return blogAuth
}

const mostLikes = (blogs) => {
  //do mostblogs but likes


  //have empty array
  //for each item in blogs
  //if blogs name matches array object name, add the likes in blog to array
  //if not, then create object with name and likes
  //go through list and find object with most likes
  //return that object

  //what if i called totalLikes for each author

  const authLikeArray = []
  const blogInfo = {
    author: '',
    likes: null
  }

  //put authors of blogs in author array, no duplicates
  for (let j = 0; j<blogs.length; j++) {
    if (!(Object.values(authLikeArray).map((creditor) => creditor.author.includes(blogs[j].author)).includes(true))) {
      const newBlogInfo = Object.create(blogInfo)
      newBlogInfo.author = blogs[j].author
      newBlogInfo.likes = blogs[j].likes
      authLikeArray.push(newBlogInfo)
      //console.log(authLikeArray, 'is authlikearray in if statement')
    }
    else {
      //console.log(`We found a match! ${blogs[j].author} already is in the list`)
      const index = authLikeArray.map((pencil) => pencil.author).indexOf(blogs[j].author)
      //console.log(index, 'is index')
      //console.log(authLikeArray[index].likes, 'should be the amount of likes that', authLikeArray[index].author, 'has')
      if (authLikeArray[index].author === blogs[j].author) {
        authLikeArray[index].likes += blogs[j].likes
      }
      //console.log(authLikeArray[index].likes, 'is the new amount')
    }
  }

  //console.log(authLikeArray, 'is auth like array at end')


  //var authArrayMatch = authLikeArray.map((izen)=> izen.likes === Math.max(...authLikeArray.map((liking) => liking.likes)) ? {author: izen.author, likes: izen.likes} : null)
  const blogAuthLikes = (authLikeArray.map((izen) => izen.likes === Math.max(...authLikeArray.map((liking) => liking.likes)) ? { author: izen.author, likes: izen.likes } : null)).filter((value) => value !== null)

  return blogAuthLikes[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}