import { ChatSocket } from '../types/chat'

// VALIDATE AFTER

const sendChat = ({ socket }: ChatSocket) => {
  return (payload: any, callback: any) => {
    const message = {
      // from: socket.request.user
      content: payload.content,
    }
    socket.broadcast.emit('chat:sent', message)

    // callback err or succes
  }
}

const initChat = ({ socket }: ChatSocket) => {
  socket.on('chat:send', () => sendChat({ socket }))
}
