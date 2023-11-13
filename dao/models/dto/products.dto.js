class productDTO{
    constructor (body){
        this.title = body.name
    }

    toObj(){
        return{
            title: this.title
        }
    }
}

module.exports = productDTO