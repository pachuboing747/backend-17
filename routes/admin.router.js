const { Router } = require('express')
const adminController = require('../controllers/admin.controller.js')

const router = Router()

router.get('/admin', adminController.getAdmin)

router.get('/editarProducto', adminController.getAdminEditarProducto)

router.post('/admin', adminController.addProductAdmin)

router.post('/editarProducto', adminController.updateProductAdmin)

module.exports = router