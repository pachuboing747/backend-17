const {productionLogger} = require('../logger/index.js')

const fn = (req, _res, next) => {
  productionLogger.http(`[${req.method}] - ${req.url} at ${(new Date()).toISOString()}`)
  next()
}

module.exports = fn
