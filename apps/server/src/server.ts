import 'dotenv/config'

import http from 'http'
import { json } from 'body-parser'
import cors from 'cors'
import express from 'express'
import { Server, Socket } from 'socket.io'

import { initChat } from './services/chat'
import { gameWaitList } from './services/game'

import 'express-async-errors'

import cookieSession from 'cookie-session'
import morgan from 'morgan'

import { errorHandler } from './middlewares/errorHandler'
import { authRouter } from './routers/auth'

// import { generateRoll } from './services/roll'

const port = process.env.PORT || 3000
const corsOptions = {
  origin: ['http://localhost:4000'],
  credentials: true,
}

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: corsOptions,
})

app.set('trust proxy', 1) // trust first proxy
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
)
app.use(morgan('dev'))
app.use(cors(corsOptions))

app.use('/api', authRouter)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.status(200).send('ok')
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

io.on('connection', (socket) => {
  // socket.broadcast.emit('game:countdown-time', counter)
  // clients[socket.id] = socket;
  console.log('a user connected')
  // // Broadcast the current counter value to new client
  // socket.broadcast.send(counter)
  // io.emit('')

  // // Update the counter every second and broadcast to all clients
  initChat({ socket })
})

// gameWaitList({ io })
/** Start game here */
