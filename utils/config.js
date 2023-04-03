require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const BIRBEMAIL = process.env.BIRB_EMAIL

const MERMEMAIL = process.env.MERMS_EMAIL

module.exports = {
  MONGODB_URI,
  PORT,
  BIRBEMAIL,
  MERMEMAIL  
}