//=========== MODULOS ===========//
import express from "express";
import ApiProductosMock from "../api/productosApi.js";
import Contenedor from "../managers/contenedor.cjs";
const ApiProductosMoc = new ApiProductosMock("./files/productos.txt");
import { mensajesDao, productosDao } from "../daos/indexDao.cjs";
//=========== ROUTER ===========//
const router = express.Router();

//=========== MIDDLEWARE ===========//
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use((req, res, next) => {
  console.log(`Product Middleware, Time: ${Date.now()}`);
  next();
});

//=========== CONTENEDOR ===========//
let products = new Contenedor("./files/productos.txt");
//new mensajesDao("./files/productos.txt");
//=========== RUTAS ===========//

router.get("/", async (req, res, next) => {
  res.render("main");
});

router.get("/products", async (req, res, next) => {
  try {
    const arrayProduct = await productosDao.getAll();
    if (arrayProduct.length === 0) {
      throw new Error("No hay products");
    }
    res.render("partials/datos", { arrayProduct });
  } catch (err) {
    next(err);
  }
});

router.get("/products-test", async (req, res, next) => {
  try {
    const arrayProduct = ApiProductosMoc.products();
    if (arrayProduct.length === 0) {
      throw new Error("No hay productos");
    }
    res.render("partials/datos", { arrayProduct });
  } catch (err) {
    next(err);
  }
});

router.get("/products/:id", async (req, res, next) => {
  try {
    const producto = await mensajesDao
      .getById(Number(req.params.id))
      .then((resolve) => resolve);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    res.json(producto);
  } catch (err) {
    next(err);
  }
});

router.post("/products", async (req, res, next) => {
  try {
    const nombresValidos = /^[a-zA-Z0-9ÑñÁáÉéÍíÓóÚú\s]+$/;
    if (!req.body.title || !req.body.price || !req.body.thumbnail) {
      throw new Error("Debes enviar un producto con nombre, precio y URL");
    }
    if (req.body.price <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }
    if (!nombresValidos.exec(req.body.title)) {
      throw new Error(
        "El nombre solo puede contener letras, números y espacios"
      );
    }
    console.log(req.body);
    await productosDao.save(req);
    res.redirect("/products");
  } catch (err) {
    next(err);
  }
});

router.put("/products/:id", async (req, res, next) => {
  try {
    const producto = await mensajesDao
      .getById(Number(req.params.id))
      .then((res) => res);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    await mensajesDao
      .update(
        Number(req.params.id),
        req.body.title,
        req.body.price,
        req.body.thumbnail
      )
      .then((resolve) => {
        res.json(resolve);
      });
  } catch (err) {
    next(err);
  }
});

router.delete("/products/:id", async (req, res, next) => {
  try {
    const producto = await mensajesDao
      .getById(Number(req.params.id))
      .then((resolve) => resolve);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    await products.deleteById(Number(req.params.id)).then((resolve) => {
      res.json(`${producto.title} se borro con éxito`);
    });
  } catch (err) {
    next(err);
  }
});

export default router;

//=========== handleErrors ===========//
function handleErrors(err, req, res, next) {
  console.log(err.message);
  res.render("datos", { err });
}
router.use(handleErrors);
