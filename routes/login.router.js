const { Router } = require('express')
const passport = require('passport')

const userManager = require('../dao/managers/user.manager.js')
const isAuth = require('../middlewares/auth.js')
const { hashPassword, isValidPassword } = require('../utils/password.js')
const {STRATEGY_NAME} = require ("../config/config.js")

const router = Router()

const signup = async (req, res) => {
  const user = req.body
  
  console.log(user)

  const existing = await userManager.getByEmail(user.email)

  if (existing) {
    return res.render('signup', {
      error: 'El email ya existe'
    })
  }

  if (user.password !== user.password2) {
    return res.render('signup', {
      error: 'Las contraseñas no coinciden'
    })
  }

  try {
    const newUser = await userManager.create({
      ...user,
      password: hashPassword(user.password)
    })

    const newCart = new Cart({ user: newUser._id });
    await newCart.save();

    req.session.user = {
      name: newUser.firstname,
      id: newUser._id,
      ...newUser._doc
    }

    console.log(req.session)

    req.session.save((err) => {
      res.redirect('/')
    })

  } catch(e) {
    return res.render('signup', {
      error: 'Ocurrio un error. Intentalo mas tarde'
    })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {

    const _user = await userManager.getByEmail(email)

    if (!_user) {
      return res.render('login', { error: 'El usuario no existe' })
    }


    const { password: _password, ...user } = _user

    if (!password) {
      return res.render('login', { error: 'El password es requerido' })
    }

    if(!isValidPassword(password, _password)) {
      return res.render('login', { error: 'Contraseña invalida' })
    }

    const cartManager = await cartManager.findById({ user: user._id });

    req.session.user = {
      name: user.firstname,
      id: user._id,
      ...user
    }

    req.session.save((err) => {
      if(!err) {
        res.redirect('/')
      }
    })
  } catch(e) {
    console.log(e)
    res.render('login', { error: 'Ha ocurrido un error' })
  }

}

const logout = (req, res) => {
  const { user } = req.cookies

  res.clearCookie('user')

  req.session.destroy((err) => {
    if(err) {
      return res.redirect('/error')
    }

    res.render('logout', {
      user: req.user.name
    })

    req.user = null
  })

}

const resetpassword = async (req, res) => {
  const { email, password1, password2 } = req.body

  console.log(email)

  const user = await userManager.getByEmail(email)

  console.log(user)

  if (!user) {
    return res.render('resetpassword', { error: 'el usuario no existe' })
  }

  if (password1 !== password2) {
    return res.render('resetpassword', { error: 'las contraseñas no coinciden' })
  }

  try {
    await userManager.save(user._id, {
      ...user,
      password: hashPassword(password1)
    })


    res.redirect('/login')

  } catch (e) {
    console.log(e)
    return res.render('resetpassword', { error: 'Ha ocurrido un error' })
  }
}

router.get('/signup', (_, res) => res.render('signup'))
router.get('/login', (_, res) => res.render('login'))
router.get('/resetpassword', (_, res) => res.render('resetpassword'))


const callback = (req,res)=>{
  const user = req.user;
  req.session.user = {
    id:user.id,
    name:user.firstname,
    role:user?.role??"costumer",
    email:user.email
  }
  res.redirect("/");
}

router.get("/github",passport.authenticate(STRATEGY_NAME), (_,res)=>{});
router.get("/githubSessions", passport.authenticate(STRATEGY_NAME), callback);


router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup'
}))

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

router.post('/resetpassword', resetpassword)
router.get('/logout', isAuth, (req, res) => {
  const { firstname, lastname } = req.user
  req.logOut((err) => {
    if(!err) {
      res.render('logout', {
        name: `${firstname} ${lastname}`
      })
    }
  })
})


module.exports = router