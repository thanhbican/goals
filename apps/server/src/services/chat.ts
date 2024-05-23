import { Request } from 'express'

import { ChatSchema, chatSchema } from '../lib/validate/chat'
import { Chat } from '../models/Chat'
import { UserDoc } from '../models/User'
import { ChatConfig, ChatSocket, ChatType } from '../types/chat'
import { CallBack } from '../types/socket'

const config: ChatConfig = {
  chats: [],
}

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
        username: currentUser.username,
        message: payload.message,
      }

      socket.broadcast.emit('chat:sent', message)

      config.chats.push(message)
      if (config.chats.length >= 9) {
        config.chats.shift()
      }

      Chat.create({ userId: currentUser.id, message: payload.message })

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

const getChats = async () => {
  const chats = await Chat.find({})
    .sort({ createdAt: -1 })
    .limit(30)
    .populate<{ userId: UserDoc }>('userId', 'username')
    .lean()
  config.chats = chats.reverse().map((chat) => ({
    username: chat.userId.username,
    message: chat.message,
  })) as ChatType[]
}

const initChat = ({ io, socket }: ChatSocket) => {
  getChats()
  socket.on('chat:send', sendChat({ socket }))

  io?.emit('chat:get-latest', {
    latestChat: config.chats,
  })
}

export { initChat }
