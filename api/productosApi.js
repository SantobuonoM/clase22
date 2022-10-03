import { Contenedor } from "../managers/contenedor.js";
import generarProductos from "../utils/generadorProductos.js";
import { generarId } from "../utils/generadorId.js";

export default class ApiProductosMock extends Contenedor {
  constructor(path) {
    super(path);
  }

  products(cant = 5) {
    const nuevos = [];
    for (let i = 0; i < cant; i++) {
      const nuevoProducto = generarProductos(generarId());
      const guardado = this.save(nuevoProducto);
      nuevos.push(guardado);
    }
    return nuevos;
  }
}
