const mongoose = require('mongoose')
const config = require ("../config/config")

const { usersModel, productsModel } = require('../dao/models')


async function generatePurchases() {

  await mongoose.connect(config.MONGO_URL)
  
  const users = await usersModel.find({ role : "Admin", gender : "Female" }).limit(10).lean()
  const products = await productsModel.find().lean()

    for (const user of users) {
    faker.helpers.shuffle(products, { inplace: true })
    const cart = faker.helpers.arrayElements(products, { min: 1, max: products.length }).map((p) => ({
        product: p,
        qty: faker.number.int({ min: 1, max: 2 })
    }))

  const po = await purchaseOrderModel.create({
      user: user._id,
      total: cart.reduce((total, p) => total += p.product.price * p.qty, 0),
      postAddress: addr._id,
      products: cart.map(({ qty, product: { _id } }) => ({
          product: _id,
          qty: qty
      })),
      estimatedDelivery: moment(faker.date.future()).unix()
  })

  console.log(po)
  await mongoose.disconnect()
}
}

generatePurchases()