const { mongoose } = require('../db')
const { Schema, Types } = require('mongoose')

module.exports = mongoose.model('sticker_sets', new Schema({
  id: Types.ObjectId,
  title: String,
  userId: String
}))
