const createJWT = require('./createJWT')
const generateRefreshToken = require('./generateRefreshToken')
const {EXPIRES_ACCESS_TOKEN} = require('../../config/config')

function createAuthTokens (payload) {
  if (!('expires' in payload)) {
    payload.expires = EXPIRES_ACCESS_TOKEN
  }
  if (!('createdAt' in payload)) {
    payload.createdAt = Date.now()
  }

  const accessToken = createJWT(payload)
  const refreshToken = generateRefreshToken()

  return {
    accessToken,
    refreshToken
  }
}

module.exports = createAuthTokens
