import ContenedorMongoDb from "../contenedores/contenedorMongoDb";

class DaoMongoDb extends ContenedorMongoDb {
  constructor() {
    super("mensajes", {
      nombre: { type: String, required: true },
      apellido: { type: String, required: true },
      email: { type: String, required: true },
      edad: { type: Number, required: true },
      alias: { type: String, required: true },
      avatar: { required: true },
      mensaje: { type: String, required: true },
    });
  }
}

export default DaoMongoDb;
