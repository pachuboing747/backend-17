const cartModel = require('../../models/cart.model.js')
const productModel = require('../../models/product.model.js')

class CartManager {

    async addCart () {

        const cart = await cartModel.create( { user: undefined, products: [] } )

        return cart
    }

    async getCart (){

        const cart = await cartModel.find({}).lean()

        return cart
    }

    async getCartById (id) {

        const cartId = await cartModel.find({_id: id})

        return cartId[0]
    }

    async addProductCart (cid, idProduct, userId, isPremiumUser) {

        let cart = await cartModel.findOne({_id: cid})

        const product = await productModel.findOne({_id: idProduct})

        if (isPremiumUser && product.owner === userId) {
            return;
        }

        const p = cart.products.find(pr => pr.product.equals(product._id))

        if(p) {
            p.quantity += 1
        } else {
            cart.products.push({
                product: product._id,
                quantity: 1
            })
        }

        cart = await cart.populate({ path: 'products.product', select: [ 'title', 'price' ] })
        
        await cart.save()

    }

    async deleteProductCart(cid, idProduct){

        let cart = await cartModel.findOne({ _id: cid })

        const productId = await productModel.findOne({ _id: idProduct })

        const productQ = cart.products.find(pr => pr.product == idProduct)
        
        if(productQ.quantity > 1){
            productQ.quantity = productQ.quantity - 1

            cart.save()
        } else {
            const p = cart.products.find(pr => pr.product.equals(productId._id))
    
            const indexProductDelete = cart.products.findIndex(function(obj) {
                return obj._id === p._id
            })
    
            if(indexProductDelete !== -1){
                cart.products.splice(indexProductDelete, 1)
            }
    
            cart.save()
        }
    }

    async deleteProductsCart(cid){

        let cart = await cartModel.findOne({_id: cid})

        cart.products = []

        cart.save()
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

        p.quantity = newQuantity.quantity

        cart.save()
    }

}

module.exports = new CartManager()