const { Router } = require('express')

const {
  getById,
  getAll,
  create,
  deleteById,
  putPatch
} = require ("../../controllers/products.controller.js")

const router = Router()

router.get('/:id', getById)
router.get('/', getAll)
router.post('/', create)
router.delete('/:id', deleteById)
router.put('/:id', putPatch)

module.exports = router
