const { Router } = require('express')
const isAuth = require('../middlewares/auth')
const {
  getAllPaged,
  chat,
  getAllRealTime,
  getAllProducts,
  getById,
  profile,
  carts,
  mocking

} = require ("../controllers/home.controller.js")

const router = Router()


router.get('/', getAllPaged)

router.get('/chat', isAuth, chat)

router.get('/realtimesProducts', getAllRealTime)

router.get("/products", getAllProducts);

router.post("/products", isAuth, getById);

router.get('/profile', isAuth, profile)

router.get("/carts", carts)

router.get("/mockingProducts", mocking)

module.exports = router