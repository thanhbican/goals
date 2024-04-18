import http from 'http'
import cookieSession from 'cookie-session'
import helmet from 'helmet'
import { Server } from 'socket.io'

import { currentUser } from '../middlewares/currentUser'
import { corsOptions } from '../utils/cors'
import { initChat } from './chat'
import { gameWaitList } from './game'

const initIo = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const io = new Server(server, {
    cors: corsOptions,
  })

  io.engine.use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'dev',
    })
  )
  io.engine.use(currentUser)
  io.engine.use(helmet())

  io.on('connection', (socket) => {
    initChat({ socket })
  })

  /** Start game here */
  gameWaitList({ io })
}

export { initIo }
