import http from 'http'
import express from 'express'
import { Server } from 'socket.io'

import { generateRoll } from './services/roll'

const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = new Server(server)

app.get('/', (req, res) => {
  res.send(200).json('ok')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

// setInterval(() => {
//   generateRoll()
// }, 1000)
// const clients = {};
let counter = 15
io.on('connection', (socket) => {
  socket.broadcast.emit('game:countdown-time', counter)
  // clients[socket.id] = socket;
  // console.log('a user connected')
  // // Broadcast the current counter value to new client
  // socket.broadcast.send(counter)

  // // Update the counter every second and broadcast to all clients
  setInterval(() => {
    counter--
    socket.broadcast.emit('game:countdown-time', counter)
  }, 1000)
})
