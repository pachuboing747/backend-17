const { authToken } = require('../utils/jwt.utils')

const apiAuth = function (req, res, next) {
    const authHeader = req.headers.authorization

    console.log(authHeader)

    if (!authHeader) {
        return res.status(401).send({
            status: 'failure',
            error: 'Not logged in'
        })
    }

    const token = authHeader.replace('Bearer ', '')

    if (!authToken(token)) {
        return res.status(401).send({
            status: 'failure',
            error: 'Not authorized'
        })
    }

    next()
}

module.exports = apiAuth