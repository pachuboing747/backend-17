const chai = require ("chai")
const supertest = require ("supertest")

const expect = chai.expect
const requestor = supertest ("http://localhost:8080")

describe ("integration", () =>{
    describe ("product", () => {

        it("product - /POST", async ()=> {
            const product = {
                title: "Camiseta titular Seleccion Argentina",
                description:"Vestite como un campeón. La insignia de campeón del Mundo y la tercera estrella sobre el escudo confirman una victoria memorable",
                price: 4200,
                stock: 3,
                thumbnail: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9d96391ff8e147a48e9aaf7300e7cf3d_9366/Camiseta_titular_Argentina_3_estrellas_2022_Blanco_IB3593_01_laydown.jpg",
            }

            const response = await requestor.post('/products').send(product)

            expect(response.status).to.equal(302);
      
        })
        it("product - /GET", async () => {
            const response = await requestor.get('/products');
    
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.payload)).to.be.false;
        });
        
    })

    describe("cart", () => {
        it("cart - /DELETE", async () => {
            const cartId = "64f77caeec1a607ffa03c5e3";
            const response = await requestor.del(`/carts/${cartId}`);
    
            expect(response.status).to.not.equal(200);
    
        });
    });

})