import http from 'http'
import mongoose from 'mongoose'

import { app } from './app'
import { SeverError } from './errors/status/serverErrror'
import { initIo } from './services/io'

const port = process.env.PORT || 3000

const startServer = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/goals')

    const server = http.createServer(app)

    server.listen(port, () => {
      console.log('Listening 3000')
    })

    initIo(server)
  } catch (err) {
    throw new SeverError()
  }
}

startServer()
