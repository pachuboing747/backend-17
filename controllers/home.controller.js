const ManagerFactory = require('../dao/managers/manager.Mongo/factory.manager.js')

const productManager = ManagerFactory.getManagerInstance('products')
const cartsManager = ManagerFactory.getManagerInstance('carts')
const {customError, ErrorType  } = require ("../error/errors.js")
const  {generateProducts} = require ("../utils/mock.js")


const getAllPaged = async (req, res) => {
    const { page = 1, size = 10 } = req.query
    const { docs: products, ...pageInfo } = await productManager.getProducts(page, size)
  
    pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&size=${size}` : ''
    pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&size=${size}` : ''
  
  
    req.session.homeCount = (req.session.homeCount || 0) + 1
  
    res.render('home', {
      title: 'Productos',
      products,
      pageInfo,
      user: req.user ?  {
        ...req.user,
        isAdmin: req.user?.role == 'admin',
      } : null,
      style: 'home'
    })
}

const chat = (req, res) => {
    res.render('chat', { 
        user: req.user ?  {
        ...req.user,
        isAdmin: req.user?.role == 'admin',
      } : null,
    })
}

const getAllRealTime = async (req, res) => {
 
    const products = await productManager.getProducts()
   
    res.render('realTimeProducts', {
      title: 'Real Time',
      products,
      user: {
        ...req.user,
        isAdmin: req.user.role == 'admin',
      },
      style: 'home'
    })
}

const getAllProducts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
  
    const pageValue = parseInt(page);
    const limitValue = parseInt(limit);
  
    const { docs: products, ...pageInfo } = await productManager.getProducts(pageValue, limitValue);
  
    res.render("products", {
      title: "Productos",
      products,
      pageInfo,
      style: "products"
    });
}

const getById = async (req, res) => {
    try {
      const { productId, title, price, description, stock, thumbnail, code } = req.body;
      const userId = req.user.id;
  
      let cart = await cartsManager.getById(userId);
  
      if (!cart) {
        const newCart = await cartsManager.create({ user: userId });
        cart = newCart;
      }
  
      cart.products.push({
        productId,
        title,
        price,
        description,
        stock,
        thumbnail,
        code,
      });
  
      await cart.save();
  
      res.redirect("/carts");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al agregar el producto al carrito");
    }
}

const profile = (req, res) => {
    res.render('profile', {
      user: req.user ?  {
        ...req.user,
        isAdmin: req.user?.role == 'admin',
      } : null,
    })
}

const carts = async(req, res)=>{

    const carts = await cartsManager.getCart()
      res.render("carts", {
      title: "Carrito",
      carts,
      style: "carrito"
    })
}

const errorHandle = (req, res, next) => {
  try {
    const customError = new Error(ErrorType.EXECUTION_ERROR);

    customError.statusCode = 500; 
    throw customError;
    
  } catch (error) {
  
    next(error);
  }
};

const mocking = (req, res) => {
  const mockedProducts = generateProducts();
  res.render('mocking', { products: mockedProducts }); 
};

module.exports = {
    getAllPaged,
    chat,
    getAllRealTime,
    getAllProducts,
    getById,
    profile,
    carts,
    errorHandle,
    mocking
}