import admin from "firebase-admin";
import config from "../config.cjs";
try {
  admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
  });
  console.log("base de datos firebase conectada");
} catch (error) {
  console.log(error);
}

class ContenedorFirebase {
  constructor(collection) {
    this.collection = collection;
    this.db = admin.firestore();
  }

  async get(req, res) {
    try {
      const product = await this.db
        .collection(this.collection)
        .where("name", "==", req.body.name)
        .get();
      //const idProduct = product.get();
      //console.log("Producto encontrado", idProduct);

      return res.send(product.docChanges);
    } catch (error) {
      throw new Error(`Error al buscar el producto: ${error}`);
    }
  }

  async listarAll() {
    try {
      const productsList = await this.db.collection(this.collection).get();
      console.log("Estos son los productos encontrados", productsList);
      return productsList;
    } catch (error) {
      throw new Error(`Error al buscar productos: ${error}`);
    }
  }

  async add(req, res) {
    try {
      let obj = await this.db.collection(this.collection).doc().set(req.body);
      return res.send(obj);
    } catch (error) {
      throw new Error(`Error al guardar: ${error.message}`);
    }
  }
  async update(req, res) {
    try {
      const upd = await this.db.collection(this.collection).doc(req.params.id).update(req.body);
      return res.send(upd);
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async deletes(req, res) {
    try {
      const product = await this.db
        .collection(this.collection)
        .doc(req.params.id)
        .delete();
      console.log("Producto borrado", product);

      return res.send(product);
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  }

  async borrarAll() {
    // version fea e ineficiente pero entendible para empezar
    try {
      const docs = await this.listarAll();
      const ids = docs.map((d) => d.id);
      const promesas = ids.map((id) => this.borrar(id));
      const resultados = await Promise.allSettled(promesas);
      const errores = resultados.filter((r) => r.status == "rejected");
      if (errores.length > 0) {
        throw new Error("no se borró todo. volver a intentarlo");
      }
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  }

  async desconectar() {}
}

export default ContenedorFirebase;
/** funcion getById */
/** funcion getAll */
/** funcion post */
/** funcion put */
/** funcion delete */
