const crypto = require('crypto')

function encryptionPassword (pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex')
}

module.exports = encryptionPassword
