//=========== MODULOS ===========//
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import express from "express";
import ApiProductosMock from "./api/productosApi.js";
const productMock = new ApiProductosMock("./files/productos.txt");
import apiProducts from "./routes/products.js";
import { Contenedor } from "./managers/contenedor.js";
import fs from "fs";
import { engine } from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import { createServer } from "http";
import { normalizar, print, denormalizar } from "./utils/normalizar.js";
import { Chat } from "./managers/chat.js";
//=========== ROUTERS ===========//
const app = express();
const httpServer = new createServer();
//=========== MIDDLEWARES ===========//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", apiProducts);
app.use("/", express.static(path.resolve(__dirname, "public")));
app.use((req, res, next) => {
  console.log(`Product Middleware, Time: ${Date.now()}`);
  next();
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send("Something it's wrong!");
});

//=========== MOTOR DE PLANTILLAS ===========//
app.set("views", path.join(__dirname, "views"));
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
  })
);
app.set("view engine", "handlebars");
app.set("views", "./views");

//=========== VARIABLES ===========//
let chat = new Contenedor("./files/chat.txt");

let products = new Contenedor("./files/productos.txt");

let listProducts = [];

try {
  let products = new Contenedor("./files/productos.txt");
  const data = async () => await products.getAll();
  data().then((list) => {
    listProducts = list;
  });
} catch (error) {
  console.error(error);
}

//=========== SERVER ===========//
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//=========== SOCKET ===========//
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("User connected");

  const arrayProduct = await products.getAll();
  const messages = await chat.getAll();

  const normalizedMessages = normalizar(messages);
  print(normalizedMessages);

  const denormalizedMessages = denormalizar(normalizedMessages);
  print(denormalizedMessages);

  socket.emit("products", arrayProduct);

  socket.emit("messages", normalizedMessages);

  socket.on("new-product", async (data) => {
    await products.save(data);
    const arrayProduct = await products.getAll();
    io.sockets.emit("products", arrayProduct);
  });

  socket.on("new-message", async (data) => {
    await chat.save(data);
    const messages = await chat.getAll();
    const normalizedMessages = normalizar(messages);
    io.sockets.emit("messages", normalizedMessages);
  });
});
