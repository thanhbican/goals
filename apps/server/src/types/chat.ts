import { Server, Socket } from 'socket.io'

export interface ChatSocket {
  socket: Socket
  io?: Server
}
