const { Router } = require('express')
const User = require('../database/models/User')
const getRandomCode = require('../utils/getRandomCode')
const clearFieldsUser = require('../utils/clearFieldsUser')
const encryptionPassword = require('../utils/encryptionPassword')
const createAuthTokens = require('../utils/createAuthTokens')
const {base64DecodeObj} = require('../utils/base64Encode')

const authRouter = Router()

/**
 * Routes
 *
 * post /registration
 * post /auth
 * get  /confirmation-code
 * post /confirmation-code
 */

authRouter.post('/registration', async (req, res) => {
  const { username, password, repeatPassword } = req.body

  if (!username ||
      !password ||
      !repeatPassword ||
      (password !== repeatPassword)
  ) {
    res.status(400)
    res.json({ error: 'Bad request. One of the fields incorrect' })
    return;
  }

  if (await User.findOne({ username })) {
    res.status(400)
    res.json({ error: 'Bad request. Username in use' })
    return;
  }

  const code = getRandomCode()

  const user = new User({
    username,
    password,
    confirmationCode: code
  })

  await user.save().catch((e) => {
    res.send(e)
  })

  res.status(200)
  res.json(clearFieldsUser(user))
})

authRouter.post('/auth', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400)
    res.json({ error: 'Bad request. One of the fields incorrect' })
    return;
  }

  const user = await User.findOne({ username })
  if (!user) {
    res.status(404)
    res.json({ error: 'Not found user' })
    return;
  }

  if (!user.confirmed) {
    res.status(400)
    res.json({ error: 'Bad request. Registration has not been confirmed' })
    return;
  }

  if (user.password !== encryptionPassword(password)) {
    res.status(401)
    res.json({ error: 'Password incorrect' })
    return;
  }

  const { accessToken, refreshToken } = createAuthTokens({ id: user._id, username: user.username })

  user.refreshToken = refreshToken
  await user.save()

  res.status(200)
  res.json({
    accessToken,
    refreshToken
  })
})

// замена старого токена
authRouter.post('/auth/refresh', async (req, res) => {
  const { userId, refreshToken } = req.body
  if (!userId || !refreshToken) {
    res.status(400)
    res.json({ error: 'Bad request. One of the fields incorrect' })
    return;
  }

  const [base63payload] = refreshToken.split('.')
  const { expires, createdAt } = base64DecodeObj(base63payload)
  if (expires + createdAt <= Date.now()) {
    res.status(401)
    res.json({ error: 'The lifetime of the refresh token has expired' })
    return;
  }

  const user = await User.findOne({ _id: userId }).exec()
  if (!user) {
    res.status(404)
    res.json({ error: 'Not found user' })
    return;
  }

  if (user.refreshToken !== refreshToken) {
    res.status(401)
    res.json({ error: 'Incorrect refresh token' })
    return;
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = createAuthTokens({ id: user._id, username: user.username })

  user.refreshToken = newRefreshToken
  await user.save()

  res.status(200)
  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  })
})

// Для подтверждения кода пользователем
authRouter.post('/auth/confirmation', async (req, res) => {
  const { code, userId } = req.body

  if (!code || !userId) {
    res.status(400)
    res.json({ error: 'Bad request. One of the fields incorrect' })
    return;
  }

  const user = await User.findOne({ _id: userId }).exec()

  if (!user) {
    res.status(404)
    res.json({ error: 'Not found userId' })
    return;
  }

  if (user.confirmationCode.toString() !== code.toString()) {
    res.status(401)
    res.json({ error: 'Incorrect confirmation code' })
    return;
  }

  user.confirmed = true
  user.confirmationCode = null

  await user.save()

  res.sendStatus(200)
})

// создание пустого пользователя
// @todo Сделать в первом релизе после MVP
// authRouter.post('/users', (req, res) => {
//
// })

module.exports = authRouter
