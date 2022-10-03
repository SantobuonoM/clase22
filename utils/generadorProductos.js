import { faker } from "@faker-js/faker";
faker.locale = "es";

export default function generarProducto(id) {
  return {
    id,
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    thumbnail: faker.image.imageUrl(),
  };
}
