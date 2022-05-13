require('dotenv').config({ path: './.env' });

const APP_SECRET = process.env.APP_SECRET || 'local-secret'
  // 3600000 - 1 hour
  // 2592000000 - 30 days
const EXPIRES_ACCESS_TOKEN = +process.env.EXPIRES_ACCESS_TOKEN || 3600000
const EXPIRES_REFRESH_TOKEN = +process.env.EXPIRES_REFRESH_TOKEN ||  2592000000

const ADMINISTRATOR_TG = +process.env.ADMINISTRATOR_TG || 0

module.exports = {
  APP_SECRET,
  EXPIRES_REFRESH_TOKEN,
  EXPIRES_ACCESS_TOKEN,
  ADMINISTRATOR_TG
}
