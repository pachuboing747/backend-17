const ErrorType = {
    DATABASE_CONNECTION: "Hubo un error al conectarse a la base de datos",
    EXECUTION_ERROR: "Algo salio mal",
    DATA_ERROR: "Hubo un error en los datos ingresados",
    USER_NOT_FOUND: "Usuario no registrado",
    ERROR_ADD_PRODUCT: "No se pudo crear el producto",
    PRODUCT_NOT_FOUND: "Producto no encontrado "

}

class CustomError extends Error {
    constructor(message, type){
        super(message)

        this.type = type
    }
}

module.exports = {
    ErrorType,
    CustomError
}

//la ruta prueba es http://localhost:8080/errorHandle