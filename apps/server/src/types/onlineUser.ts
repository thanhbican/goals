import { Server, Socket } from 'socket.io'

export interface OnlineUserSocket {
  socket: Socket
  io: Server
}
