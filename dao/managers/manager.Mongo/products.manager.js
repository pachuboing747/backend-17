const productModel = require('../../models/product.model.js')

class ProductManager {

    async addProduct ( producto ) {

        if (!producto.owner) {
            producto.owner = 'admin';
        }
        
        const product = await productModel.create( producto )

        return product
        
    }

    async getProducts ( page = 1, limit = 10, query, sort) {

        if(sort == 1 || sort == -1){

            const opciones = {
                page: page,
                limit: limit,
                sort: { price: sort },
                lean: true
            }
    
            if(query){
    
                const query1 = {}
        
                query1["$or"] = [
                    query
                ]

                const products = await productModel.paginate( query1, opciones )
        
                return products
            } else{
                const products = await productModel.paginate( {}, opciones )
        
                return products
            }
        } else {
            
            const opciones = {
                page: page,
                limit: limit,
                lean: true
            }
    
            if(query){
    
                const query1 = {}
        
                query1["$or"] = [
                    query
                ]
                const products = await productModel.paginate( query1, opciones )
        
                return products
            } else{
                const products = await productModel.paginate( {}, opciones )
        
                return products
            }
        }

    }
    
    async getProductById ( id ) {
        const products = await productModel.find({ _id: id })

        return products[0]
    }
    
    async updateProduct (id, product) {

        const existingProduct = await productModel.findById(id);

        if (!existingProduct) {
            return null;
        }

        if (existingProduct.owner !== 'admin' && existingProduct.owner !== userId) {
            return null;
        }

        if (isAdmin || existingProduct.owner ===  "admin" || existingProduct.owner === userId){
            const result = await productModel.updateOne({ _id: id }, product);
            return result;
        }else{
            return null;
        }
        
       
    }

    async deleteProduct (id, userId, isAdmin) {

        const existingProduct = await productModel.findById(id);

        if (!existingProduct) {
            return null;
        }
        if (isAdmin || existingProduct.owner === userId){

            const result = await productModel.deleteOne({ _id: id })
            return result
        }else{
            return null;
        } 
        
    }


}

module.exports = new ProductManager()