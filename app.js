(async () => {
  const dotenv = require ("dotenv")
  dotenv.config()

  const http = require('http')
  const path = require('path')

  const express = require('express')
  const handlebars = require('express-handlebars')
  const { Server } = require("socket.io");
  const mongoose = require('mongoose')
  const cookieParser = require('cookie-parser')
  const session = require('express-session')
  const MongoStore = require('connect-mongo')
  const passport = require('passport')

  const swaggerJsDoc = require("swagger-jsdoc");
  const swaggerUiExpress = require("swagger-ui-express");

  const config = require ("./config/config.js")
  const Routes = require('./routes/index.js')
  const socketManager = require('./websocket/index.js')
  const {developmentLogger,productionLogger} = require ("./logger/index.js")
  const initPassport = require('./config/passport.init.js')

  const loggerMidleware = require ("./middlewares/logger.middleware.js")

  const cartRouter = require("./routes/carts.router.js")
  const userRouter = require("./routes/api/users.router.js")

  const {currentDirname} = require ("./utils/index.js")

  console.log(config)

  try {

    productionLogger.warn("conectandose a la base de datos...");

    await mongoose.connect(config.MONGO_URL)

    const specs = swaggerJsDoc({
      definition: {
        openapi: "3.0.1",
        info: {
          title: "Productos y Carrito",
          description: "Documentación de productos y el carrito de compras",
        },
      },
      apis:[`${currentDirname}/../doc/**/*.yaml`],
    })

    const app = express() 
    const server = http.createServer(app)
    const io = new Server(server) 

    app.use(loggerMidleware)

    app.engine('handlebars', handlebars.engine())
    app.set('views', path.join(__dirname, '/views'))
    app.set('view engine', 'handlebars')

    app.use(express.urlencoded({ extended: true }))

    app.use(express.json())
    app.use('/static', express.static(path.join(__dirname + '/public')))
    app.use(cookieParser('esunsecreto'))
    
    app.use(session({
      secret: 'esunsecreto',
      resave: true,
      saveUninitialized: true,

      store: MongoStore.create({
        mongoUrl: "mongodb+srv://pachu1982721:VPXombCDAVDvOaVQ@cluster0.lvefot0.mongodb.net/ecommerce?retryWrites=true&w=majority",
        ttl: 60 * 60
      })
    }))

    initPassport()
    
    app.use(passport.initialize())
    app.use(passport.session())
    

    app.use((req, res, next) => {

      console.log(req.session, req.user)
      next()
    })

    app.use('/', Routes.home)
    app.use('/api', (req, res, next) => {
      req.io = io
      next()
    }, Routes.api, cartRouter)
    app.use('/api/user', userRouter);

    app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

    app.get('/loggerTest', (req, res) => {
      productionLogger.error('Esto es un mensaje de error (desarrollo)');
  
      res.send('Registros completados. Verifica la consola y el archivo "errors.log".');
    });

    app.use((err, req, res, next) => {
      productionLogger.error("error")
      productionLogger.error(err.message)
    
      res.send({
        success: false,
        error: err.stack
      })
    })

    io.on('connection', socketManager)

    const port = 8080

    server.listen(port, () => {
      productionLogger.info(`Express Server listening at http://localhost:${port}`)
    })

    productionLogger.debug('se ha conectado a la base de datos')
  } catch(e) {
    productionLogger.error('no se ha podido conectar a la base de datos');
  }

})()
