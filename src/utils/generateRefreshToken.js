const crypto = require('crypto')
const {EXPIRES_REFRESH_TOKEN} = require('../../config/config')
const {base64EncodeObj} = require('./base64Encode')

function generateRefreshToken () {
  const token = crypto.randomBytes(40).toString('hex')
  const payload = { expires: EXPIRES_REFRESH_TOKEN, createdAt: Date.now() }

  const hashPayload = base64EncodeObj(payload)

  const hashToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('base64url');

  return hashPayload + '.' + hashToken
}

module.exports = generateRefreshToken
