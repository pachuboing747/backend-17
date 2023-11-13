const jwt = require('jsonwebtoken')

const SECRET = "verysecretpassword"


const generateToken = (user) => {
    return jwt.sign(user, SECRET, {
        expiresIn: '24h',
    })
}

const authToken = (token) => {
    try {
        return jwt.verify(token, SECRET)
    } catch (e) {
        return false
    }
}

module.exports = {
    generateToken,
    authToken
}