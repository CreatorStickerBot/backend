require('dotenv').config({ path: './.env' });

const MONGO_USER = process.env.MONGO_USER || 'root'
const MONGO_PASS = process.env.MONGO_PASS || '123qwe'
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'creator_sticker'
const MONGO_DB_HOST = process.env.MONGO_DB_HOST || 'localhost'
const MONGO_DB_PORT = process.env.MONGO_DB_PORT || '27017'

module.exports = {
  MONGO_PASS,
  MONGO_USER,
  MONGO_DB_NAME,
  MONGO_DB_HOST,
  MONGO_DB_PORT,
}
