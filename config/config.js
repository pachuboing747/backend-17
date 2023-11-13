module.exports = {
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    STRATEGY_NAME:process.env.STRATEGY_NAME,
    mail: {
        GMAIL_ADDRESS: process.env.GMAIL_ADDRESS,
        GMAIL_PWD: process.env.GMAIL_PWD
    },
    PERSISTANCE: process.env.MANAGER_PERSISTANCE,
}