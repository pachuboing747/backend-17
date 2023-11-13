const productModel = require ('../models/product.model')
const BaseManager = require ("./base.manager.js")

class ProductManager extends BaseManager  {

  constructor(){
    super(productModel)
  }
}

module.exports = new ProductManager() 
