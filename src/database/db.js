const mongoose = require('mongoose')
const {MONGO_USER, MONGO_PASS, MONGO_DB_NAME, MONGO_DB_HOST, MONGO_DB_PORT} = require('../../config/database')

async function connection () {
  try {
    await mongoose.connect(`mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}`, {
      bufferCommands: false,
      auth: {
        username: MONGO_USER,
        password: MONGO_PASS
      },
      dbName: MONGO_DB_NAME
    })
    console.log('Success connection MongoDB')
    return true
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  connection,
  mongoose
}
