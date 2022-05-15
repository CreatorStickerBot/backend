const app = require('./app')
const { connection } = require('./database/db')

const { VM_HOST, BACKEND_PORT } = require('../config/config')

async function start() {
  await connection()

  app.listen(BACKEND_PORT, '0.0.0.0', () => {
    console.log(`listen on 0.0.0.0:${BACKEND_PORT}`)
  })
}

start()
