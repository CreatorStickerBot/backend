require('dotenv').config({ path: './.env' });

const APP_SECRET = process.env.APP_SECRET || 'local-secret'
  // 3600000 - 1 hour
  // 2592000000 - 30 days
const EXPIRES_ACCESS_TOKEN = +process.env.EXPIRES_ACCESS_TOKEN || 3600000
const EXPIRES_REFRESH_TOKEN = +process.env.EXPIRES_REFRESH_TOKEN ||  2592000000

const ADMINISTRATOR_TG = +process.env.ADMINISTRATOR_TG || 0

const BACKEND_PORT = +process.env.BACKEND_PORT
const VM_HOST = process.env.VM_HOST
const BOT_PORT = process.env.BOT_PORT

module.exports = {
  APP_SECRET,
  EXPIRES_REFRESH_TOKEN,
  EXPIRES_ACCESS_TOKEN,
  ADMINISTRATOR_TG,
  BACKEND_PORT,
  BOT_PORT,
  VM_HOST
}
