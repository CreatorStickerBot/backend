const crypto = require('crypto')
const {APP_SECRET} = require('../../config/config')

function validateAccessToken (accessToken) {
  const [ header, payload, signature ] = accessToken.split('.')

  return signature === crypto.createHmac('SHA256', APP_SECRET).update(`${header}.${payload}`).digest('base64url')
}

module.exports = validateAccessToken
