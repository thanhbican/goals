import { Types } from 'mongoose'
import { Server, Socket } from 'socket.io'

export interface ChatType {
  username: string
  message: string
}

export interface ChatConfig {
  chats: ChatType[]
}
export interface ChatSocket {
  socket: Socket
  io?: Server
}
