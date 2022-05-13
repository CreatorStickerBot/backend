const validateAccessToken = require('../utils/validateAccessToken')
const { base64DecodeObj } = require('../utils/base64Encode')

const User = require('../database/models/User')

/**
 * @param { Response } res
 * @param { string } message
 */
function noAuthResponse (res, message) {
  res.status(401)
  res.send(message)
}

/**
 * @param { Request } req
 * @param { Response } res
 * @param next
 */
async function protectionMiddleware (req, res, next) {
  // Get auth headers
  const { authorization } = req.headers
  if (!authorization || !authorization.includes('Bearer ')) {
    noAuthResponse(res, 'No authorization header')
    return;
  }

  // validate access token
  const accessToken = authorization.split(' ')[1]
  if (!validateAccessToken(accessToken)) {
    noAuthResponse(res, 'Incorrect access token')
    return;
  }

  // getting a payload from an access token
  const [_, base64payload] = accessToken.split('.')
  const payload = base64DecodeObj(base64payload)
  const { id, expires, createdAt } = payload

  // checking the lifetime of the access token
  if (expires + createdAt <= Date.now()) {
    noAuthResponse(res, 'The lifetime of the access token has expired')
    return;
  }

  const user = await User.findOne({ _id: id }).exec()

  if (!user) {
    noAuthResponse(res, 'The user by the provided id was not found')
    return;
  }

  req.user = user
  req.accessToken = accessToken
  next()
}

module.exports = protectionMiddleware
