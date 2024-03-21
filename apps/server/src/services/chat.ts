import { ChatSocket } from '../types/chat'

// VALIDATE AFTER

const sendChat = ({ socket }: ChatSocket) => {
  return (payload: any, callback: any) => {
    // if (typeof callback !== 'function') {
    //   return
    // }
    const message = {
      // from: socket.request.user
      from: socket.id || 'sam',
      content: payload.content,
    }
    socket.broadcast.emit('chat:sent', message)

    // // callback err or success
    callback({
      status: 'OK',
      data: {
        message,
      },
    })
  }
}

const initChat = ({ socket }: ChatSocket) => {
  socket.on('chat:send', sendChat({ socket }))
}

export { initChat }
