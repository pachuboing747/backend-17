const socket = io()

const realTimeProducts = document.querySelector('#realTimeProducts')


function addToCart(productId) {
  socket.emit('addToCart', { userId: 1, productId })
}

function addProductToDOM({ price, id, title, description, keywords }) {
  const div = document.createElement('div')
  
  div.innerHTML = `
    <div class="uk-card uk-card-default">
        <div class="uk-card-media-top">
          <img alt="foto producto" />
        </div>
        <div class="uk-card-body">
          <h3 class="uk-card-title">${title}</h3>
          <h5>USD ${price}</h5>
            ${keywords.reduce((acc, key) => acc + `<span class="uk-badge">${key}</span>`, '')}
          <p>${description}</p>
          <button onclick="addToCart(${id})" class="uk-button uk-button-secondary uk-button-small">Agregar al carrito</button>
        </div>
      </div>
  `
  realTimeProducts.appendChild(div)
}

socket.on('productsInCart', (products) => {
  cartBadgeEl.innerHTML = products.length
})


socket.on('msg', (msg) => {
  console.log(msg)
})

socket.on('productoNew', (product) => {
  addProductToDOM(product)
})


