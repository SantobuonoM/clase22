import ContenedorFirebase from "../contenedores/contenedorFirebase.cjs";

class DaoFirebase extends ContenedorFirebase {
  constructor() {
    super("mensajes");
  }
}

export default DaoFirebase;
