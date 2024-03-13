import http from 'http'
import cors from 'cors'
import express from 'express'
import { Server } from 'socket.io'

import { gameWaitList } from './services/game'
import { generateRoll } from './services/roll'

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

app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send(200).json('ok')
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
})

/** Start game here */
// gameWaitList({ io })
