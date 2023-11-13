const { Router } = require('express')
const ProductRoutes = require('./api/products.router.js')
const UserRoutes = require('./api/users.router.js')
const HomeRoutes = require('./home.router.js')
const LoginRoutes = require('./login.router.js')
const CartsRoutes = require ("./carts.router.js")
const MailRoutes = require ("./api/notification.router.js")

const api = Router();

api.use('/products', ProductRoutes);
api.use('/users', UserRoutes);
api.use("/carts", CartsRoutes);
api.use("/notification", MailRoutes)


const home = Router()

home.use('/', HomeRoutes)
home.use('/', LoginRoutes)

module.exports = {
  api,
  home
};