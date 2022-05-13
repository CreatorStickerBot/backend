const crypto = require('crypto')

const {APP_SECRET} = require('../../config/config')
const { base64EncodeObj } = require('./base64Encode')

function createJWT (payload) {
  const header = { alg: 'SHA256', typ: 'JWT' }
  const unsignedToken = base64EncodeObj(header) + '.' + base64EncodeObj(payload)
  const signature = crypto.createHmac('SHA256', APP_SECRET).update(unsignedToken).digest('base64url')

  return unsignedToken + '.' + signature
}

module.exports = createJWT

