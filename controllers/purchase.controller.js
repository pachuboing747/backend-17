const { Router } = require('express')
const cartManager = require("../dao/managers/cart.manager.js")
const productManager = require('../dao/managers/product.manager.js')
const CustomRouter = require('../routes/api/custom.router.js')

class CartRouter extends CustomRouter {

  init() {

    this.router.param('cartId', async (req, res, next, cartId) => {
      try {
        const cart = await cartManager.getById(cartId)

        if (!cart) {
          return res.status(404).send({
            success: false,
            error: "Cart not found"
          })
        }

        req.cart = cart

        next()
      } catch (e) {
        res.status(500).send({
          success: false,
          error: e.stack
        })
      }
    })


    this.get('/:cartId/purchase', ["PUBLIC"], async (req, res) => {
      const { cartId } = req.params


      const cart = await cartManager.getById(cartId)

      if (!cart) {
        return res.sendStatus(404)
      }

      const { products: productsInCart } = cart
      const products = [] // dto

      
      for (const { product: id, qty } of productsInCart) {
        


        const p = await productManager.getById(id)


        if (!p.stock) {
          return
        }

        const toBuy = p.stock >= qty ? qty : p.stock

        products.push({
          id: p._id,
          price: p.price,
          qty: toBuy
        })

        p.stock = p.stock - toBuy

        await p.save()
      }


      const po = {
        user: null, 
        code: null,
        total: products.reduce((total, { price, qty}) => (price * qty) + total, 0), // calcular el total de los productos
        products: products.map(({ id, qty}) =>  {
          return {
            product: id,
            qty
          }
        })
      }

      console.log(po)


      res.send(po)
    })
    }
}


module.exports = {
  custom: new CartRouter()
}