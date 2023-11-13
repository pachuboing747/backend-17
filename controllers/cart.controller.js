const ManagerFactory = require('../dao/managers/manager.Mongo/factory.manager.js')

const cartsManager = ManagerFactory.getManagerInstance('carts')
const productManager = ManagerFactory.getManagerInstance('products')
const purchaseManager = ManagerFactory.getManagerInstance('purchases')
const userManager = ManagerFactory.getManagerInstance('users')

const mailSenderService = require('../service/mail.sender.js')

const CartModel = require ("../dao/models/cart.model.js")
const {lastname, firstname} = require ("../dao/models/user.model.js")
const {checkPermissions} = require("../controllers/user.controller.js")


const getAll = async (req, res) => {

    const { search, max, min, limit } = req.query;
    const carts = await cartsManager.getAll();
  
    let filtrados = carts;
  
    if (search) {
      filtrados = filtrados.filter(
        (p) =>
          p.keywords.includes(search.toLowerCase()) ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    if (min || max) {
      filtrados = filtrados.filter(
        (p) => p.price >= (+min || 0) && p.price <= (+max || Infinity)
      );
    }
  
    res.send(filtrados);
}

const populate = async (req, res) => {
    try {
      const id = req.params.cid;
      const cart = await cartsManager.getPopulate(id);
  
      if (!cart) {
        res.status(404).send("No se encuentra un carrito de compras con el identificador proporcionado");
      } else if (cart.products.length === 0) {
        res.status(201).send("Este carrito no contiene productos seleccionados");
      } else {
        res.status(201).send(cart);
      }
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).send("Ocurrió un error al obtener el carrito");
    }
}

const create = async (req, res) => {
  const { body, io } = req;
  const usuarioActual = req.user;
  const productId = req.params.productId;
  
  if (usuarioActual.role === 'premium' && productId === usuarioActual.email) {
    res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito.' });
  } else {
    try {
    const cart = new CartModel({
      products: [
      {
        product: body.productId,
        qty: 1,
        title: body.title,
        description: body.description,
        price: body.price,
        thumbnail: body.thumbnail,
        code: body.code,
        stock: body.stock,
      },
      ],
    });
    
    const savedCart = await cart.save();
      io.emit("newProduct", savedCart);
    
      res.status(201).send(savedCart);
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      res.status(500).send("Ocurrió un error al crear el carrito");
    }
  }
   
}

const deleteId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await cartsManager.delete(id);
  
      if (result) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.sendStatus(500);
    }
}

const deleteProducts = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await cartsManager.getById(cid);
  
      if (!cart) {
        return res.status(404).send("No se encuentra un carrito de compras con el identificador proporcionado");
      }
  
      const productIndex = cart.products.findIndex(product => product.id === pid);
  
      if (productIndex === -1) {
        return res.status(404).send("Producto no encontrado en el carrito");
      }
  
      cart.products.splice(productIndex, 1);
  
      await cart.save();
  
      res.status(200).send("Producto eliminado del carrito exitosamente");
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      res.status(500).send("Ocurrió un error al eliminar el producto del carrito");
    }
}

const getById = async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
  
      const cart = await cartsManager.getById(cid);
      if (!cart) {
        return res.status(404).send("No se encuentra un carrito de compras con el identificador proporcionado");
      }
  
      cart.products = products;
  
      const updatedCart = await cart.save();
  
      res.status(200).json(updatedCart);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      res.status(500).send("Ocurrió un error al actualizar el carrito");
    }
}

const findById = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const { qty } = req.body;
  
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
  
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );
  
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
      }
  
      cart.products[productIndex].qty = qty;
      await cart.save();
  
      return res.status(200).json({ message: 'Cantidad de producto actualizada en el carrito' });
    } catch (error) {
      console.error('Error al actualizar la cantidad de producto en el carrito:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  
}

const deleteAll = async (req, res) => {
    const { cid } = req.params;
  
    try {
      const result = await cartsManager.deleteAll(cid);
  
      if (result) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error al eliminar los productos del carrito:", error);
      res.sendStatus(500);
    }
}

const  updateCart = async (req, res)  => {
  const { cid } = req.params
  const { body } = req

  try {
      const cartId = await cartsManager.getCartById( cid )
      if(!cartId){
          res.status(404).send({
              Error: 'ID DE CARRITO INEXISTENTE'
          })
          return
      }
      
      await cartsManager.updateCart(cid, body)
      res.status(202).send({ Accepted: `El carrito con id: ${cid} ha sido modificado.` })
  } catch (error) {
      console.log(error)
      res.status(500).send({ error: 'Ocurrio un error en el sistema'})
  }
}

const  updateProductCart = async (req, res) =>{
  const { cid, idProduct } = req.params
  const { body } = req

  try {
      const cartId = await cartsManager.getCartById( cid )

      if(!body == { qty: Number }){
          console.log('Error')
      }
      
      if(!cartId){
          res.status(404).send({
              Error: 'ID DE CARRITO INEXISTENTE'
          })
          return
      }
  
      if(!cartId.products.find(pr => pr.product == idProduct)){
          res.status(404).send({
              Error: 'ID DEL PRODUCTO INEXISTENTE'
          })
          return
      }
  
      await cartsManager.updateProductCart(cid, body, idProduct) 
      res.status(202).send({ Accepted: `El producto con id: ${idProduct} del carrito con id: ${cid} ha modificado su cantidad` })

  } catch (error) {
      console.log(error)
      res.status(500).send({ error: 'Ocurrio un error en el sistema'})
  }

}

const purchase = async (req, res) =>{
  const { cid } = req.params

      let cart = await cartsManager.getById(cid)

      if(!cart) {
          return res.sendStatus(404)
      }

      const { products: productsInCart } = cart
      const products = [] 
      const productsDelete = []

      for (const { product: id, qty } of productsInCart) {
          
        const p = await productManager.getProductById(id)

        if(!p.stock){
          return
        }

        const toBuy = p.stock >= qty ? qty : p.stock

        products.push({
          id: p._id,
          price: p.price,
          qty: toBuy
        })
          
          if(qty > p.stock){
            productsDelete.push({
              id: p._id,
              unPurchasedQuantity: qty - p.stock
            })
          } 
          
          if(p.stock > qty){
            await cartsManager.deleteProductsCart(cid)
          }
          
          p.stock = p.stock - toBuy
          
          await p.save()
       
          console.log(p)
      }

      for(const { id, unPurchasedQuantity } of productsDelete) {
          await cartsManager.addProductCart(cid, id)
          await cartsManager.updateProductCart(cid, {qty: unPurchasedQuantity}, id)
      }

      cart = await cart.populate({ path: 'user', select: [ 'email', 'firstname', 'lastname' ]})

      const today = new Date()
      const hoy = today.toLocaleString()

      let user = await userManager.getById()

      const order = {
          user: firstname,
          code: Date.now(),
          total: products.reduce((total, { price, qty }) => (price * qty) + total, 0),
          products: products.map(({ id, qty }) => {
              return {
                  product: id,
                  qty
              }
          }),
          purchaser: user,
          purchaseDate: hoy
      }

      purchaseManager.addOrder(order)

      const template = `
          <h2>¡Hola ${firstname}!</h2>
          <h3>Tu compra fue realizada con exito. Aqui te dejamos el ticket de compra.</h3>
          <br>
          <div style="border: solid 1px black; width: 310px;">
              <h3 style="font-weight: bold; color: black; text-align: center;">Comprobante de Compra</h3>
              <ul style="list-style: none; color: black; font-weight: 500;">
                  <li>Nombre y Apellido: ${firstname}, ${lastname}</li>
                  <li>Codigo: ${order.code}</li>
                  <li>Catidad de Productos Comprados: ${order.products.length}</li>
                  <li>Total: $ ${order.total}</li>
                  <li>Fecha: ${order.purchaseDate}</li>
              </ul>
          </div>

          <h3>¡Muchas gracias, te esperamos pronto!</h3>
      `

      mailSenderService.send(order.purchaser, template)

      res.status(202).send(
      {
        Accepted: `!Felicitaciones ha finalizado su compra!. Orden enviada por mail`,
        unPurchasedProducts: productsDelete
      })

      

}

const  getOrders = async (req, res) => {

  const orders = await purchaseManager.getOrders()

  res.send(orders)
}

const  getOrderById = async (req, res) => {
  const { id } = req.params

  try {
      
      const order = await purchaseManager.getOrderById(id)
      if(!order){
          res.status(404).send({
              Error: 'ID DE LA ORDEN INEXISTENTE'
          })
          return
      }

      res.send(order)

  } catch (error) {
      console.log(error)
      res.status(500).send({ error: 'Ocurrio un error en el sistema'})
  }
}

const  deleteOrder  = async (req, res) => {
  const { id } = req.params

  try {
      
      const order = await purchaseManager.getOrderById(id)
      if(!order){
          res.status(404).send({
              Error: 'ID DE LA ORDEN INEXISTENTE'
          })
          return
      }

      await purchaseManager.deleteOrder(id)
      res.status(202).send({Accepted: `Se ha eliminado con exito la orden con id: ${id}`})

  } catch (error) {
      console.log(error)
      res.status(500).send({ error: 'Ocurrio un error en el sistema'})
  }
}


module.exports = {
  getAll,
  populate,
  create,
  deleteId,
  deleteProducts,
  getById,
  findById,
  deleteAll,
  purchase,
  updateProductCart,
  updateCart,
  getOrders,
  getOrderById,
  deleteOrder
}