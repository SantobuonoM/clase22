const { normalize, schema, denormalize } = normalizr;
const socket = io();

const buttonChat = document.getElementById("buttonChat");

socket.on("messages", (data) => {
  const denormalizedData = normalizr.denormalize(
    data.result,
    schemaMensajes,
    data.entities
  );
  const porcN = JSON.stringify(data).length;
  const porcDN = JSON.stringify(denormalizedData).length;
  let porcT = (100 * porcDN) / porcN;
  const htmlPorc = `<h4>Compresión: ${porcT.toFixed(1)}%</h4>`;
  const porcentajeDOM = document.getElementById("porcentaje");
  porcentajeDOM.innerHTML = htmlPorc;

  let msgHtml = "";
  msgHtml = denormalizedData.mensajes.map((item) => {
    return `<span>
    <div class="d-flex flex-column" style="width:500px">
     <div class="d-flex justify-content-between w-100 bg-dark">
     <img src="${item.author.avatar}" style="width:50px;height:50px">
      <p class="text-light fw-bolder" >${item.author.email}</p>
    </div>
      <p class="text-success"><em>${item.text}</em></p>
    </span>
    </div>
    <hr>
    `;
  });
  document.getElementById("msg").innerHTML = msgHtml;
});
buttonChat.addEventListener("click", (e) => {
  const msg = {
    author: {
      email: document.getElementById("email").value,
      nombre: document.getElementById("name").value,
      apellido: document.getElementById("lastname").value,
      edad: document.getElementById("age").value,
      alias: document.getElementById("alias").value,
      avatar: document.getElementById("avatar").value,
    },
    text: document.getElementById("comment").value,
  };
  console.log(msg);
  socket.emit("new-messages", msg);
});
const insertCompresionHTML = (compresion) => {
  let div = document.getElementById("compresion");
  const resultado = `Porcentaje de compresión ${compresion}%`;
  div.innerHTML = resultado;
};
const renderMensajes = (messages) => {
  let listadoMensajes = document.getElementById("messages");

  listadoMensajes.innerHTML = html;
};

socket.on("mensaje-servidor", (productos, messages, compresion, products) => {
  renderMensajes(messages);
  insertCompresionHTML(compresion);
});
