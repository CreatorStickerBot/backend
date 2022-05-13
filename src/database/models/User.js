const { mongoose } = require('../db')
const { Schema, Types} = require('mongoose')
const encryptionPassword = require('../../utils/encryptionPassword')

module.exports = mongoose.model('users', new Schema({
  id: Types.ObjectId,
  username: String,
  password: {
    type: String,
    set: (val) => encryptionPassword(val)
  },
  telegramId: Number,
  confirmed: Boolean,
  confirmationCode: Number,
  refreshToken: String,
}))
