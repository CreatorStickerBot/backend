const app = require('./app')
const { connection } = require('./database/db')

const { VM_HOST, BACKEND_PORT } = require('../config/config')

async function start() {
  await connection()

  app.listen(BACKEND_PORT, VM_HOST, () => {
    console.log(`listen on ${VM_HOST}:${BACKEND_PORT}`)
  })
}

start()
