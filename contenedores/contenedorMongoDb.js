import mongoose from "mongoose";
import config from "../config.js";
/** inicializar conexion a db */

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options);

class ContenedorMongoDb {
  /** crea la tabla/collection a persistir */

  constructor(collection, schema) {
    this.collection = collection;
    this.model = mongoose.model(collection, schema);
  }

  /** funcion getById */
  async get(req, res) {
    try {
      const prod = await this.model.findById(req.params.id);
      console.log(this.collection + " encontrado ", prod);
      return res.send(prod);
    } catch (error) {
      throw new Error(
        `Error al buscar el  ${this.collection}, ${error.message}`
      );
    }
  }

  /** funcion getAll */
  async listarAll() {
    try {
      const prods = await this.model.find();
      console.log("Producto encontrado", prods);
    } catch (error) {
      throw new Error(
        `Error al buscar los ${this.collection}, ${error.message}`
      );
    }
  }
  /** funcion post */

  async add(req, res) {
    try {
      const prod = await this.model.create(req.body);
      console.log("Producto guardado", prod);
      return res.send(prod);
    } catch (error) {
      throw new Error(
        `Error al guardar el ${this.collection}, ${error.message}`
      );
    }
  }

  //ad prod to cart
  async addProductToCarrito(req, res) {
    const idCarrito = req.params.id;
    if (!idCarrito)
      return res
        .status(400)
        .send({ message: "Ingresa el ID de un carrito listado" });
    const { idProduct } = req.body;
    const productSaved = await this.model.updateOne(
      {
        _id: idCarrito,
      },
      {
        $push: { products: idProduct },
      }
    );
    if (!productSaved) return res.status(404).send({ message: "Error" });
    res.json({ message: productSaved });
  }

  //deleteProdFromCart
  async deleteOneProduct(req, res) {
    try {
      const idCarrito = req.params.id;
      const { id_prod } = req.params;

      const productToDelete = await this.model.updateOne(
        {
          _id: idCarrito,
        },
        {
          $pull: { products: id_prod },
        }
      );

      return res.send("Producto eliminado!");
    } catch (error) {
      console.log(error);
    }
  }

  /** funcion put */
  async update(req, res) {
    try {
      const upd = await this.model.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: req.body,
        }
      );
      console.log("Producto actualizado", upd);
      return res.send(upd);
    } catch (error) {
      throw new Error(
        `Error al actualizar el ${this.collection}, ${error.message}`
      );
    }
  }
  /** funcion delete */

  async delete(req, res) {
    return res.send(
      await this.model.deleteOne({
        _id: req.params.id,
      })
    );
  }
  /** funcion delete */

  async borrarAll() {
    return this.model.deleteMany({});
  }
}

export default ContenedorMongoDb;
