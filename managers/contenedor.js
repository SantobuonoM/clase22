import fs from "fs";
export class Contenedor {
  constructor(path) {
    this.filePath = path;
    this.items = this.readData();
  }

  async getAll() {
    this.items = this.readData();
    return [...this.items];
  }

  getById(id) {
    const elem = this.items.find((elem) => elem.id === id);
    if (!elem) {
      throw new Error(`No existe el producto con id ${id}`);
    } else {
      return elem;
    }
  }

  async save(obj) {
    try {
      const array = await this.getAll();
      array.push(obj);
      const data = JSON.stringify(array, null, 2);
      fs.writeFileSync(this.filePath, data, "utf-8");
      return obj;
    } catch (error) {
      throw error;
    }
  }

  deleteAll() {
    this.items = [];
  }

  deleteById(id) {
    const index = this.items.findIndex((elem) => elem.id === id);
    if (index == -1) {
      throw new Error(`No existe el producto con id ${id}`);
    } else {
      this.items.splice(index, 1);
    }
  }

  update(elem) {
    elem.id = +elem.id;
    const index = this.items.findIndex((elem) => elem.id === elem.id);
    if (index == -1) {
      throw new Error(`No existe el producto con id ${elem.id}`);
    } else {
      this.items[index] = elem;
      return elem;
    }
  }
  readData() {
    try {
      return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    } catch (error) {
      console.log(error);
      if (error.message.includes("no such file or directory")) return [];
    }
  }
  async writeData() {
    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(this.objects, null, 2)
    );
  }
}
