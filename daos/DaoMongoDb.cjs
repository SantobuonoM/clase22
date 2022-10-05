
const ContenedorMongoDb = require("../contenedores/contenedorMongoDb.cjs");

class DaoMongoDb extends ContenedorMongoDb {
  constructor(collection, modelSchema) {
    super(collection, modelSchema);
  }

  //     nombre: { type: String, required: true },
  //     apellido: { type: String, required: true },
  //     email: { type: String, required: true },
  //     edad: { type: Number, required: true },
  //     alias: { type: String, required: true },
  //     avatar: { type: String, required: true },
  //     mensaje: { type: String, required: true },
  //   });
  // }
}
module.exports = DaoMongoDb;
