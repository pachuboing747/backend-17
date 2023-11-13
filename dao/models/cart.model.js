const { Schema, model } = require('mongoose')

const schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "users"},
  products: { 
    type: [{
      product: { type: Schema.Types.ObjectId , ref: "products"},
      qty: { type: Number, default: 0 },
      title: {type: String, index: true},
      description: String,
      price: {type:Number, index: true},
      thumbnail:String,
      code: String,
      stock:Number,
    }],
    default: []
  },
  createdDate: { type: Number, default: Date.now() }
})

schema.pre("findOne", function () {
  this.populate({ path: 'user', select: ['email', 'firstname', 'lastname'] })
})

const cartModel = model('carts', schema)

module.exports = cartModel