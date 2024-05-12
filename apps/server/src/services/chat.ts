import { Request } from 'express'

import { ChatSchema, chatSchema } from '../../lib/validate/chat'
import { ChatSocket } from '../types/chat'
import { CallBack } from '../types/socket'

const sendChat = ({ socket }: ChatSocket) => {
  return (payload: ChatSchema, callback: CallBack) => {
    if (typeof callback !== 'function') {
      return
    }

    try {
      chatSchema.parse(payload)
      const req = socket.request as Request
      const currentUser = req.currentUser
      if (!currentUser)
        return callback({
          status: 'ERROR',
        })

      const message = {
        from: currentUser.username,
        message: payload.message,
      }
      socket.broadcast.emit('chat:sent', message)

      callback({
        status: 'OK',
        data: {
          message,
        },
      })
    } catch (error) {
      callback({
        status: 'ERROR',
        error,
      })
    }
  }
}

const initChat = ({ socket }: ChatSocket) => {
  socket.on('chat:send', sendChat({ socket }))
}

export { initChat }
