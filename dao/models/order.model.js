const { Schema, model } = require('mongoose')

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users'},
    code: String,
    total: Number,
    products: {
        type: [{
            product: { type: Schema.Types.ObjectId, ref: 'products' },
            qty: { type: Number, default: 0 }
        }],
        default: []
    },
    purchaser: String,
    purchaseDate: String
})

const orderModel = model('orders', schema)

module.exports = orderModel