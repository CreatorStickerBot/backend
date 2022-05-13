const { Router } = require('express')
const { readFileSync } = require('fs')
const path = require('path')
const protectionMiddleware = require('../middleware/protectionMiddleware')
const User = require('../database/models/User')
const Message = require('../database/models/Message')
const {ADMINISTRATOR_TG} = require('../../config/config')
const botApi = require('../api/botApi')

const botRouter = Router()
const jsonFileUsersPath = path.resolve('./', 'available-user-testers.json')

botRouter.all('/check-life', (_, res) => {
  res.status(200)
  res.send('ok')
})

// проверка авторизации запроса к боту
botRouter.get('/auth/confirmation-request', protectionMiddleware, (req, res) => {
  res.sendStatus(200)
})

// Для получения кода подтверждения ботом
botRouter.post('/confirmation-code', async (req, res) => {
  const { telegramId, username } = req.body

  if (!telegramId || !username) {
    res.status(400)
    res.json({ error: 'Bad request. One of the fields incorrect' })
    return;
  }

  const user = await User.findOne({ username }).exec()

  if (!user) {
    res.status(404)
    res.json({ error: 'Not found username' })
    return;
  }

  user.telegramId = telegramId
  await user.save()

  res.json({ code: user.confirmationCode, confirmed: user.confirmed })
})

// Подтверждение того, что у пользователя есть технический доступ в систему
botRouter.post('/confirmation-actions', async (req, res) => {
  const { telegramId } = req.body

  let users = []

  try {
    users = JSON.parse(readFileSync(jsonFileUsersPath, 'utf-8'))
  } catch (e) {
    console.log(e)
  }

  if (!users.includes(ADMINISTRATOR_TG))
    users.push(ADMINISTRATOR_TG)

  if (users.includes(telegramId))
    res.sendStatus(200)
  else
    res.sendStatus(401)
})

// Сохранение сообщений, которые писали боту
botRouter.post('/save-message', async (req, res) => {
  const { message } = req.body

  const newMessage = new Message({ message })
  await newMessage.save()

  res.sendStatus(200)
})

module.exports = botRouter
