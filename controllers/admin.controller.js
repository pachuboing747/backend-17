const ManagerFactory = require('../dao/managers/manager.Mongo/factory.manager')

const productManager = ManagerFactory.getManagerInstance('products')
const cartManager = ManagerFactory.getManagerInstance('carts')

class AdminController {

    async getAdmin (req, res) {

        const cart = await cartManager.getCartById(req.user.cart._id)
    
        res.render('admin/admin', {
            title: 'Agregar un nuevo producto',
            style: 'admin',
            user: req.user ? {
                ...req.user,
                isAdmin: req.user.role == 'admin',
                isPublic: req.user.role == 'Customer'
            } : null,
            idCart: cart._id
        })
    
    }
    
    async getAdminEditarProducto (req, res) {

        res.render('admin/editarProducto', {
            title: 'Editar un producto',
            style: 'admin',
            user: req.user ? {
                ...req.user,
                isAdmin: req.user.role == 'admin',
                isPublic: req.user.role == 'Customer'
            } : null
        })
    }

    async addProductAdmin (req, res) {

        await productManager.addProduct(req.body)
    
        res.redirect('/admin/admin')
    }

    async updateProductAdmin (req, res) {

        const {id, ...body} = req.body

        productManager.updateProduct(id, body)

        res.redirect('/')

    }
}

module.exports = new AdminController()