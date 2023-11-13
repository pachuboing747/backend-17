const local = require('passport-local')
const ManagerFactory = require('../dao/managers/manager.Mongo/factory.manager.js')

const userManager = ManagerFactory.getManagerInstance('users')
const cartManager = ManagerFactory.getManagerInstance('carts')

const { hashPassword, isValidPassword } = require('../utils/password')

const LocalStrategy = local.Strategy



const signup = async (req, email, password, done) => {
  const { email: _email, password: _password, password2: _password2, ...user } = req.body

  const _user = await userManager.getByEmail(email)

  if (_user) {
    console.log('usuario ya existe')
    return done(null, false)
  }

  try {

    const cart = await cartManager.addCart()

    const newUser = await userManager.create({
      ...user,
      password: hashPassword(password),
      cart: cart
    })

    let cartId = await cartManager.getCartById(newUser.cart._id)
    cartId.user = newUser._id

    cartId.save()

    return done(null, {
      name: newUser.firstname,
      id: newUser._id,
      ...newUser._doc
    })

  } catch(e) {
    console.log('ha ocurrido un error')
    done(e, false)
  }
}
const login = async (email, password, done) => {
  try {
    const _user = await userManager.getByEmail(email)

    if (!_user) {
      console.log('usuario no existe')
      return done(null, false)
    }

    if (!password) {
      return done(null, false)
    }

    if(!isValidPassword(password, _user.password)) {
      console.log('credenciales no coinciden')
      return done(null, false)
    }

    done(null, _user)

  } catch(e) {
    console.log('ha ocurrido un error')
    done(e, false)
  }
}


module.exports = {
  LocalStrategy,
  signup,
  login,
}
