import ContenedorArchivo from "../contenedores/contenedorArchivo.js"

class DaoArchivo extends ContenedorArchivo {

    constructor(rutaDir) {
        super(`${rutaDir}/mensajes.txt`)
    }
}

export default DaoArchivo
