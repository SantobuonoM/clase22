const  Contenedor = require ("../managers/contenedor.cjs")

class CarritoDaoArchivo extends Contenedor {

    constructor(rutaDir) {
        super(`${rutaDir}`)
    }
}

module.exports= CarritoDaoArchivo
