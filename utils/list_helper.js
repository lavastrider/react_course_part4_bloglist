const dummy = (blogs) => {
  const blogArray = blogs
  
  return 1
}

const totalLikes = (blog) => {
  //console.log(blog)
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}