const chatMessageModel = require('../../models/chat.message.model.js')

class ChatMessageManager {

    getMessages() {
        return chatMessageModel.find().lean()
    }

    addMessage( message ) {

        return chatMessageModel.create( message )

    }

}

module.exports = new ChatMessageManager()