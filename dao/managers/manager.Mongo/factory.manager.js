const productManager = require('../manager.Mongo/products.manager')
const cartManager = require('../manager.Mongo/cart.manager.js')
const chatMessageManager = require('../manager.Mongo/chat.manager.js')
const userManager = require('../manager.Mongo/user.manager')
const purchaseManager = require('../manager.Mongo/purchase.manager.js')

const productManagerFile = require('../product.manager')
const cartManagerFile = require('../cart.manager')
const userManagerFile = require('../user.manager')

const { PERSISTANCE } = require('../../../config/config.js')

class ManagerFactory {

    static getManagerInstance(name) {

        if(PERSISTANCE == 'mongo') {
            switch (name) {
                case 'products':
                    return productManager;
                
                case 'carts': 
                    return cartManager;

                case 'chatMessages': 
                    return chatMessageManager;

                case 'users': 
                    return userManager;

                case 'purchases': 
                    return purchaseManager;
            }
        } else {
            switch (name) {
                case 'products':
                    return productManagerFile;
                
                case 'carts': 
                    return cartManagerFile;
                
                case 'users': 
                    return userManagerFile;
            }
        }
    }
}

module.exports = ManagerFactory