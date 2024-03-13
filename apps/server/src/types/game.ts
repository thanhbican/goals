import { Server, Socket } from 'socket.io'

export interface GameSocket {
  socket?: Socket
  io: Server
}
