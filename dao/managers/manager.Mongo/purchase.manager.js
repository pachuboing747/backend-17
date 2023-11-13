const orderModel = require('../../models/order.model.js')

class PurchaseManager {

    async addOrder ( orden ) {
        
        const order = await orderModel.create( orden )

        return order
        
    }

    async getOrders () {

        const orders = await orderModel.find({})

        return orders
    }
    
    async getOrderById ( id ) {

        const orders = await orderModel.find({ _id: id })

        return orders[0]
    }
    
    async updateOrder (id, order) {
        
        const result = await ordertModel.updateOne({ _id: id }, order)

        return result
    }

    async deleteOrder (id) {
        
        const result = await orderModel.deleteOne({ _id: id })

        return result
        
    }

}

module.exports = new PurchaseManager()