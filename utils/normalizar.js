import { normalize, schema, denormalize } from "normalizr";
import util from "util";

const author = new schema.Entity("author");
const text = new schema.Entity("text", {
  author: author,
});

export const print = (obj) => {
  console.log(util.inspect(obj, false, 12, true));
};

export function normalizar(mensajes) {
  const normalizar = mensajes.map((message) => ({
    author: message.author,
    date: message.date,
    text: message.text,
    id: message.id,
  }));

  const normalizados = normalize(
    {
      id: "mensajes",
      messages: normalizar,
    },
    text
  );

  return normalizados;
}

export const denormalizar = (obj) => {
  return denormalize(obj.result, text, obj.entities);
};
