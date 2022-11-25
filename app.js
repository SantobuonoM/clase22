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

import { User } from "./managers/user.js";
import passport from "passport";
import bCrypt from "bcrypt";
import log4js from "log4js";
import { Strategy as LocalStrategy } from "passport-local";

import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

import fs from "fs";
import exphbs from "express-handlebars";
import path from "path";
import { fork } from "child_process";
import minimist from "minimist";
import ApiProductosMock from "./api/productosApi.js";
const productMock = new ApiProductosMock("./files/productos.txt");
import { Chat } from "./managers/chat.js";
import mensajesDao from "./daos/indexDao.cjs";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

const MONGO_DB_URI =
  "mongodb+srv://yopopoy19:42501719@cluster0.b03da.mongodb.net/?retryWrites=true&w=majority";

//=========== ROUTERS ===========//
const app = express();
const httpServer = new HttpServer(app);
const io = new ioServer(httpServer);

//=========== MIDDLEWARES ===========//
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_DB_URI,
      ttl: 600,
    }),
    secret: "sh",
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      maxAge: 600000,
    },
  })
);
app.use("/", apiProducts);

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send("Something it's wrong!");
});

//=========== MOTOR DE PLANTILLAS ===========//
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");

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
const PORT = process.env.PORT || 8081;
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
import { config } from "process";
const print = (obj) => {
  console.log(util.inspect(obj, false, 12, true));
};

//=========== PASSPORT =============//
app.use(passport.session());

passport.use(
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, cb) => {
      let validatePassword = (user, password) => {
        return bCrypt.compareSync(password, user.password);
      };
      User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          console.log("User Not Found with username " + username);
          return cb(null, false);
        }
        if (!validatePassword(user, password)) {
          console.log("Invalid Password");
          return cb(null, false);
        }
        return cb(null, user);
      });
    }
  )
);

passport.use(
  "register",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    function (req, username, password, cb) {
      const findOrCreateUser = function () {
        User.findOne({ username: username }, function (err, user) {
          if (err) {
            console.log("Error in SignUp: " + err);
            return cb(err);
          }
          if (user) {
            console.log("User already exists");
            return cb(null, false);
          } else {
            let newUser = new User();
            let createHash = function (password) {
              return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
            };
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.save((err) => {
              if (err) {
                console.log("Error in Saving user: " + err);
                throw err;
              }
              console.log("User Registration succesful");
              return cb(null, newUser);
            });
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.get("/ses", (req, res) => {
  console.log(req.session);
  res.send("anda a mirar la consola");
});

app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  (req, res) => {
    res.render("main");
  }
);

app.get("/faillogin", (req, res) => {
  res.render("login-error", {});
});

app.get("/register", (req, res) => {
  loggerWarn.warn(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  res.render("register");
});

app.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),

  (req, res) => {
    res.redirect("/");
  }
);

app.get("/failregister", (req, res) => {
  loggerError.error(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  res.render("register-error", {});
});

app.get("/logout", (req, res, next) => {
  const { username } = req.user;
  req.logout({ username }, (err) => {
    if (err) return next(err);
  });
  res.render("logout", { username });
});

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    const { username } = req.user;
    res.render("main", { username });
  } else {
    res.render("login");
  }
});
app.get("/", (req, res) => {
  loggerTodos.info(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  if (req.isAuthenticated()) {
    res.render("main", { username: req.user.username });
  } else {
    res.render("login");
  }
});

app.get("*", (req, res) => {
  loggerTodos.warn(`metodo ${req.method} Ruta inexistente ${req.originalUrl}`);
  const html = `<div> direccion no valida </div>`;
  res.status(404).send(html);
});

app.get("/datos", async (req, res) => {
  if (req.user) {
    const datosUsuario = await User.findById(req.user._id).lean();
    res.render("datos", {
      datos: datosUsuario,
    });
  } else {
    res.redirect("/login");
  }
});
/*============================[logs]============================*/
log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    miLoggerFile: { type: "file", filename: "warn.log" },
    miLoggerFile2: { type: "file", filename: "error.log" },
  },
  categories: {
    default: { appenders: ["miLoggerConsole"], level: "trace" },
    archivo: { appenders: ["miLoggerFile"], level: "warn" },
    archivo2: { appenders: ["miLoggerFile2"], level: "error" },
    todos: { appenders: ["miLoggerConsole", "miLoggerFile2"], level: "info" },
  },
});

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

//=========== PASSPORT ===========//
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, cb) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          console.log("User Not Found with username " + username);
          return cb(null, false);
        }
        if (!validatePassword(user, password)) {
          console.log("Invalid Password");
          return cb(null, false);
        }
        return cb(null, user);
      });
    }
  )
);

const validatePassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

/*passport.use(
  "register",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    function (req, username, password, cb) {
      const findOrCreateUser = function () {
        User.findOne({ username: username }, function (err, user) {
          if (err) {
            console.log("Error in SignUp: " + err);
            return cb(err);
          }
          if (user) {
            console.log("User already exists");
            return cb(null, false);
          } else {
            let newUser = new User();
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.save((err) => {
              if (err) {
                console.log("Error in Saving user: " + err);
                throw err;
              }
              console.log("User Registration succesful");
              return cb(null, newUser);
            });
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }
  )
);*/
const loggerWarn = log4js.getLogger("archivo");

const loggerError = log4js.getLogger("archivo2");

const loggerTodos = log4js.getLogger("todos");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
