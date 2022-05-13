const { mongoose } = require('../db')
const { Schema } = require('mongoose')

module.exports = mongoose.model('messages', new Schema({
  message: String
}))
