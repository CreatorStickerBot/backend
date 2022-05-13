const app = require('./app')
const { connection } = require('./database/db')

async function start() {
  await connection()

  app.listen(3001, () => {
    console.log('listen on 3001')
  })
}

start()
