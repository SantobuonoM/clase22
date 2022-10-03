import { normalize, schema, denormalize } from "normalizr";
import util from "util";
const socket = io();

const author = new schema.Entity("author");
const text = new schema.Entity("text", {
  author: author,
});


const denormalizar = (obj) => {
  return denormalize(obj.result, text, obj.entities);
};

socket.on("products", (data) => {
  render(data);
});

socket.on("messages", (data) => {
  renderMessages(data);
});

function render(data) {
  let html = data
    .map((elem, index) => {
      return `<tr>
      <td>${elem.title}</td>
      <td>${elem.price}</td>
      <td><img src="${elem.thumbnail}" alt="Imagen del producto" style="width: 4rem;"></td>
      </tr>`;
    })
    .join(" ");
  document.getElementById("tbproducts").innerHTML = html;
}

function renderMessages(data) {
  const denormalizedMessages = denormalizar(data);
  let html = denormalizedMessages.messages
    .map((elem, index) => {
      return `<div>
        <span style="color: blue; font-weight: bold;">${elem.author.nombre}</span>
        <span style="color: blue; font-weight: bold;">${elem.author.apellido}</span>
        <span style="color: blue; font-weight: bold;">(${elem.author.id}),</span>
        <span style="color: blue; font-weight: bold;">(${elem.author.alias})</span>
        <span style="color: blue; font-weight: bold;"><img src="${elem.author.avatar}" alt="Avatar del usuario"></span>
        <span style="color: brown;">[${elem.date}]:</span>
        <span style="color: green; font-style: italic;">${elem.text}</span></div>`;
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
}

function addProduct() {
 alert("llegue")
  let producto = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
  };
  debugger;
  socket.emit("new-product", producto);
  document.getElementById("title").value = "";
  document.getElementById("price").value = "";
  document.getElementById("thumbnail").value = "";
  return false;
}

function addMessage() {
  console.log("toy");
  let message = {
    author: {
      id: document.getElementById("email").value,
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      edad: document.getElementById("edad").value,
      alias: document.getElementById("alias").value,
      avatar: document.getElementById("avatar").value,
    },
    text: document.getElementById("message").value,
    date: formatDate(),
  };
  socket.emit("new-message", message);

  document.getElementById("message").value = "";
  document.getElementById("message").focus();

  return false;
}

const formatDate = () => {
  let date = new Date();
  let formatted_date = `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(
    -2
  )}/${date.getFullYear()} ${date.getHours()}:${
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  }:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}`;
  return formatted_date;
};
