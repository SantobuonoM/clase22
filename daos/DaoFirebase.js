import ContenedorFirebase from "../contenedores/contenedorFirebase.js";

class DaoFirebase extends ContenedorFirebase {
  constructor() {
    super("mensajes");
  }
}

export default DaoFirebase;
