const cartModel = require("../../dao/models/cart.model");
const BaseManager = require ("./base.manager.js")


class CartsManager extends BaseManager {

  constructor(){
    super(cartModel)
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await this.model.findById(cartId);

      if (!cart) {
        return null;
      }

      const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

      if (productIndex === -1) {
        return null; 
      }

      cart.products[productIndex].qty = newQuantity;
      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }
  
  async getPopulate(id) {
    try {
      const cart = await this.model.findById(id).populate("products.product");
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      return null;
    }
  }

  async updateCart (cid, product){

    let cart = await cartModel.findOne({ _id: cid })

    cart.products = product

    cart.save()

}

  async updateProductCart (cid, newQuantity, idProduct) {
    let cart = await cartModel.findOne({ _id: cid })

    const productId = await productModel.findOne({ _id: idProduct})

    const p = cart.products.find(prod => prod.product.equals(productId._id))

    p.qty = newQuantity.qty

    cart.save()
  }


  async getCartById (req, res) {
      const { cid } = req.params

      try {
          
          const cartId = await cartModel.getCartById( cid )
          if(!cartId){
              res.status(404).send({
                  Error: 'ID DE CARRITO INEXISTENTE'
              })
              return
          }

          res.send(cartId)

      } catch (error) {
          console.log(error)
          res.status(500).send({ error: 'Ocurrio un error en el sistema'})
      }

  }

  async addCart (req, res) {
    
   await this.model.addCart()
    res.status(201).send({Created: 'El carrito fue creado con exito!'})

}

}


module.exports = new CartsManager ();

