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
    return `
     <p class"my-2 messages__container">
            <img src="${item.author.avatar}"  class="img-fluid img__producto" alt="">
            <span class="text-info email">${item.author.email}</span>
            <span class="text-success">${item.text}</span>
      </p>
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
  let div = document.getElementById("porcentaje");
  const resultado = `Porcentaje de compresión ${compresion}%`;
  div.innerHTML = resultado;
};
const renderMensajes = (messages) => {
  // let listadoMensajes = document.querySelector("ul");
  // let item = document.createElement("li");
  // item.textContent = messages;
  // listadoMensajes.appendChild(item);
  let msgHtml = "";
  msgHtml = messages.map((item) => {
    return `
    

    <p class"my-2 messages__container">
            <img src="${item.author.avatar}" width="50" height="50" alt=""  class="img-fluid" >
            <span style="color: blue; font-weight: bold;">${item.author.alias}</span>
            <span class="text-success; font-weight: bold;">:   ${item.text}</span>
      </p>
    `;
  });
  document.getElementById("msg").innerHTML = msgHtml;
};

socket.on("messages-servidor", (normalizedMessages, compresion) => {
  renderMensajes(normalizedMessages);
  insertCompresionHTML(compresion);
});
