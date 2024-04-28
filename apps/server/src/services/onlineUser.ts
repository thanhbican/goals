import { Request } from 'express'

import { OnlineUserSocket } from '../types/onlineUser'

let onlineUsers: string[] = []

const initOnlineUser = ({ io, socket }: OnlineUserSocket) => {
  console.log('connect')
  const req = socket.request as Request
  const currentUser = req.currentUser

  if (!currentUser) {
    io.emit('user:online', { onlineUsers: onlineUsers.length })
    return
  }

  const { id } = currentUser

  const existUser = onlineUsers.find((userId) => userId === id)
  if (!existUser) {
    onlineUsers.push(id)
  }

  // Emit the updated user list
  io.emit('user:online', { onlineUsers: onlineUsers.length })

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((userId) => userId !== id)
    io.emit('user:online', { onlineUsers: onlineUsers.length })
  })
}

export { initOnlineUser }
