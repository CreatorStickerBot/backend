const express = require('express')
const cors = require('cors')
const router = require('./routers/router')
const authRouter = require('./routers/authRouter')
const botRouter = require('./routers/botRouter')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', authRouter)
app.use('/api', router)
app.use('/api/bot', botRouter)

module.exports = app
