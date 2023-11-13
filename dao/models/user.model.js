const { Schema, model } = require('mongoose')

const schema = new Schema({
  firstname: String,
  lastname: { type: String, index: true },
  email: { type: String, index: true },
  password: String,
  role: { type: String, default: 'Customer' },
  gender: String,
  age: { type: Number },
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'carts',
  },
  premium: Boolean,
  last_connection: {
    type: Date,
    default: Date.now,
  },
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
})

const userModel = model('users', schema)

module.exports = userModel