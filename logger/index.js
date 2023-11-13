const { 
  createLogger, 
  transports: { Console, File },
  format: { combine, colorize, simple }
} = require('winston')

const options = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    debug: 'white'
  }
}

const developmentLogger = createLogger({
  transports: [
    new Console({
      level: "debug",
      format: combine(
        colorize({ colors: options.colors }),
        simple()
      )
    }),

  ]
})

const productionLogger = createLogger({
  transports: [
    new Console({
      level: "info",
      format: combine(
        colorize({ colors: options.colors }),
        simple()
      ),
    }),
    new File({
      filename: './logs/error.log',
      level: 'error',
      format: simple(),
    }),
  ],
});

module.exports = {
  developmentLogger,
  productionLogger,
}