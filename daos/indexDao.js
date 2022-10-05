import config from "../../config.js";

let mensajesDao;

switch (config.MODO_PERSISTENCIA) {
  case "firebase":
    const { default: DaoFirebase } = await import("./DaoFirebase.js");
    mensajesDao = new DaoFirebase();
    break;
  case "mongodb":
    const { default: DaoMongoDb } = await import("./DaoMongoDb.js");
    mensajesDao = new DaoMongoDb();
    break;
  default:
    const { default: DaoArchivo } = await import("./DaoArchivo");
    mensajesDao = new DaoArchivo();
    break;
}

export default mensajesDao;
