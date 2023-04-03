const gravRouter = require('express').Router()
const md5 = require('md5')
const config = require('../utils/config')
const middle = require('../utils/middleware')
const logger = require('../utils/logger')
const User = require('../models/user')
const axios = require('axios')

gravRouter.get('/', async (request, response) => {
  //this is the function to call gravatar api and then store info at /api/grav

  const userData = await User.find({})
  //console.log(userData, 'is userdata in gravrouter')
  
  const userDataMap = userData.map((user) => ({id: user.id, emailAddress: user.emailAddress}))
  //console.log(userDataMap, 'is userdata map before append')
  
  for (let i = 0; i < userDataMap.length; i++) {
    if (userDataMap[i].emailAddress) {
      try {
        var userEmail = userDataMap[i].emailAddress
        var emailTrim = userEmail.trim()
        var emailLower = emailTrim.toLowerCase()
        var emailCleanHashT = md5(emailLower)
        var userImg = await axios.get(`https://www.gravatar.com/${emailCleanHashT}.json`)
        //console.log(userImg.data, 'is user img data in for loop')
        userDataMap[i].thumbnail = userImg.data.entry[0].thumbnailUrl
        console.log(userDataMap[i], 'is entry after key value append')
      } catch (error) {
        console.log('we are in the catch block')
        userDataMap[i].thumbnail = 'https://media.istockphoto.com/id/1368239780/photo/clown-fish.jpg?b=1&s=170667a&w=0&k=20&c=mBdC45x6navTxLRmA7_k7srPFGvbQmaBf6HINhwkE-Q='
      }
    }
  }
  
  //console.log(userDataMap, 'is user data map after doing append')
  
  if (userDataMap) {
    response.json(userDataMap)
  } else {
    response.status(404).end
  } 
})

module.exports = gravRouter