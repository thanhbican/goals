import http from 'http'
import mongoose from 'mongoose'
import { Server, Socket } from 'socket.io'

import { app } from './app'
import { SeverError } from './errors/status/serverErrror'
import { initChat } from './services/chat'
import { gameWaitList } from './services/game'
import { corsOptions } from './utils/cors'

const port = process.env.PORT || 3000

const startServer = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/goals')

    app.listen(port, () => {
      console.log('Listening 3000')
    })

    const server = http.createServer(app)
    const io = new Server(server, {
      cors: corsOptions,
    })
    io.on('connection', (socket) => {
      console.log('a user connected')

      initChat({ socket })
    })

    /** Start game here */
    // gameWaitList({ io })
  } catch (err) {
    throw new SeverError()
  }
}

startServer()
