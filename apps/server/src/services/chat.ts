import { ChatSocket } from '../types/chat'

// VALIDATE AFTER

const sendChat = ({ socket }: ChatSocket) => {
  console.log('sa')
  return (payload: any, callback: any) => {
    // if (typeof callback !== 'function') {
    //   return
    // }
    console.log(callback)
    const message = {
      // from: socket.request.user
      content: payload.content,
    }
    console.log(message)
    socket.broadcast.emit('chat:sent', message)

    // // callback err or success
    callback({
      status: 'OK',
      data: {
        id: message,
      },
    })
  }
}

const initChat = ({ socket }: ChatSocket) => {
  console.log('test')
  socket.on('chat:send', sendChat({ socket }))
}

export { initChat }
