const config = require("../config.cjs");
let mongoSchema = {
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true },
  edad: { type: Number, required: true },
  alias: { type: String, required: true },
  avatar: { type: String, required: true },
  mensaje: { type: String, required: true },
};
let productoSchema = {
  title: { type: String, required: true },
  price: { type: Number, required: false },
  thumbnail: { type: String, required: false },
};

let mensajesDao;
let productosDao;
switch (config.MODO_PERSISTENCIA) {
  case "firebase":
    const { default: DaoFirebase } = require("./DaoFirebase.cjs");
    mensajesDao = new DaoFirebase();
    productosDao = new DaoFirebase();
    break;
  case "mongodb":
    const DaoMongoDb = require("./DaoMongoDb.cjs");
    mensajesDao = new DaoMongoDb("mensajes", mongoSchema);
    productosDao = new DaoMongoDb("productos", productoSchema);
    break;
  default:
    const DaoArchivo = require("./DaoArchivo.cjs");
    mensajesDao = new DaoArchivo(config.fileSystem.path);
    productosDao = new DaoArchivo(config.fileSystem.path);
    break;
}

module.exports = { mensajesDao, productosDao };
