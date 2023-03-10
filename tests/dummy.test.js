const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  
  const listEmpty = []
  
  const listBigger = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
     },
    {
      _id: '1234567890abcdefghijklmnop',
      title: 'The Impact of ChatGPT on Buzzfeed Clickbait',
      author: 'Not ChatGPT',
      url: 'ripbuzzfeedtchatgpt.com',
      likes: 75,
      __v: 0
     } 
    ]
  
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listEmpty)
    expect(result).toBe(0)  
  })
  
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
  
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listBigger)
    expect(result).toBe(80)
  })
})

describe('favoriteBlog', () => {
  const listBigger = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
     },
    {
      _id: '1234567890abcdefghijklmnop',
      title: 'The Impact of ChatGPT on Buzzfeed Clickbait',
      author: 'Not ChatGPT',
      url: 'ripbuzzfeedtchatgpt.com',
      likes: 75,
      __v: 0
     } 
    ]

  test('of a blog that is the favorite is returned with title author and likes', () => {
    const result = listHelper.favoriteBlog(listBigger)
    expect(result).toEqual({title: 'The Impact of ChatGPT on Buzzfeed Clickbait', author: 'Not ChatGPT', likes: 75})
  })
 })
 
 describe('mostBlogs', () => {
 //  test('of the author that has the most blogs written', () => {
//    const result = listHelper.mostBlogs(listBlogs)
//    expect(result).toEqual()
//  })
})