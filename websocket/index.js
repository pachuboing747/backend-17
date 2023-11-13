const productManager = require('../dao/managers/product.manager.js')
const chatMessageManager = require('../dao/managers/chat.message.manager.js')


async function socketManager(socket) {
  console.log(`user has connected: ${socket.id}`)

  const messages = await chatMessageManager.getAll()
  socket.emit('chat-messages', messages)

  socket.on('chat-message', async (msg) => {
    console.log(msg)
    await chatMessageManager.create(msg)
    socket.broadcast.emit('chat-message', msg)
  })

  
}

module.exports = socketManager