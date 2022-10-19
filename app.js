//=========== MODULOS ===========//
import express from "express";
import apiProducts from "./routes/products.js";
import Contenedor from "./managers/contenedor.cjs";
import { Server as HttpServer } from "http";
import { Server as ioServer } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from "fs";
import exphbs from "express-handlebars";
import path from "path";

import ApiProductosMock from "./api/productosApi.js";
const productMock = new ApiProductosMock("./files/productos.txt");
import { Chat } from "./managers/chat.js";
import mensajesDao from "./daos/indexDao.cjs";

//=========== ROUTERS ===========//
const app = express();
const httpServer = new HttpServer(app);
const io = new ioServer(httpServer);
//=========== MIDDLEWARES ===========//
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", apiProducts);

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send("Something it's wrong!");
});

//=========== MOTOR DE PLANTILLAS ===========//
app.set("views", path.join(__dirname, "views"));
app.set("view engine", ".hbs");
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "index",
    layoutsDir: path.resolve(__dirname, "views/layouts"),
    partialsDir: path.resolve(__dirname, "views/partials"),
    extname: ".hbs",
  })
);

//=========== VARIABLES ===========//
let chat = new Chat("./files/chat.txt");

let products = new Contenedor("./files/productos.txt");

let listProducts = [];

/*try {
  let products = new Contenedor("./files/productos.txt");
  const data = async () => await products.getAll();
  data().then((list) => {
    listProducts = list;
  });
} catch (error) {
  console.error(error);
}*/

//=========== SERVER ===========//
const PORT = process.env.PORT || 8080;
const server = httpServer.listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);
server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
/* ------------------ Normalizr ---------------- */
import normalizr from "normalizr";
const { normalize, schema, denormalize } = normalizr;

import util from "util";
const print = (obj) => {
  console.log(util.inspect(obj, false, 12, true));
};
//=========== SOCKET ===========//

io.on("connection", async (socket) => {
  console.log("User connected");

  const arrayProduct = await products.getAll();
  socket.emit("products", arrayProduct);
  socket.on("new-product", async (data, cb) => {
    console.log("Escucho backend new-product");
    await products.save(data);
    const arrayProduct = await products.getAll();
    io.sockets.emit("products", arrayProduct);
  });

  const messages = await chat.getMessages();
  let pesoOriginal = JSON.stringify(messages).length;
  console.log(`El tamaño original del archivo era de: `, pesoOriginal);

  const authorSchema = new schema.Entity("author");

  const msgSchema = new schema.Entity("message", { author: authorSchema });

  const finalSchema = [msgSchema];
  // const mensajeSchema = new schema.Entity("messages", {
  //   id: idSchema,
  //   author: authorSchema,
  //   text: textSchema,
  // });
  const normalizedMessages = normalize(messages, [finalSchema]);
  console.log(
    `Luego el tamaño del archivo quedó en: `,
    JSON.stringify(normalizedMessages).length
  );
  let pesoComprimido = JSON.stringify(normalizedMessages).length;
  const compresion = ((pesoComprimido * 100) / pesoOriginal).toFixed(2);
  console.log(`El porcentaje de compresión ha sido del: ${compresion} %`);
  socket.emit("messages-servidor", messages, compresion);

  socket.on("new-messages", async (msg) => {
    console.log(msg);
    console.log("Escucho backend new-message");
    await chat.saveMessages(msg);
    const messages = await chat.getMessages();

    io.sockets.emit("messages-servidor", normalizedMessages);
  });
});

//=========== MONGO ===========//
