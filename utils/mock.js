const {faker} = require ("@faker-js/faker")

const generateProducts = (count = 100) => {
    const products = []

    for (let i = 0; i < count; i++){
        products.push({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price:   faker.commerce.price(),
            stock:faker.number.int({ min: 0, max: 1000 }) ,
            thumbnail: faker.image.url()
        })
    }
    return products
}

module.exports = {
    generateProducts
}