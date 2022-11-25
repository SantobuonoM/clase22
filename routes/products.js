//=========== MODULOS ===========//
import express from "express";
import ApiProductosMock from "../api/productosApi.js";
import Contenedor from "../managers/contenedor.cjs";
const ApiProductosMoc = new ApiProductosMock("./files/productos.txt");
import { mensajesDao, productosDao } from "../daos/indexDao.cjs";
import { fork } from "child_process";

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



router.get("/products", async (req, res, next) => {
  try {
    const arrayProduct = await productosDao.getAll();
    if (arrayProduct.length === 0) {
      throw new Error("No hay products");
    }
    res.render("datos", { arrayProduct });
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
    res.render("datos", { arrayProduct });
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
/*---------------- RUTAS NUMEROS RANDOM E INFO -------------- */

router.get("/api/randoms/", (req, res) => {
  let cantDatos = parseInt(req.query.cant);
  const forked = fork("./utils/randomNumbers.js");

  forked.on("message", (numbers) => {
    res.send(numbers);
    console.log(numbers);
  });
  forked.send(cantDatos);
  console.log("random succesful");
  console.log(cantDatos);
});

router.get("/info", (req, res) => {
  const info = {
    sistema: process.platform,
    nodeVersion: process.version,
    memory: process.memoryUsage().rss,
    path: process.cwd(),
    processId: process.pid,
  };

  res.send(info);
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
      console.log(err);
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
