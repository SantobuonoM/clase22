import { promises as fs } from "fs";

class ContenedorArchivo {
  constructor(ruta) {
    this.ruta = ruta;
  }

  async get(req, res) {
    const objs = await this.listarAll();
    const buscado = objs.find((o) => o.id == req.params.id);
    return res.send(buscado);
  }

  async listarAll() {
    try {
      const objs = await fs.readFile(this.ruta, "utf-8");
      return JSON.parse(objs);
    } catch (error) {
      return [];
    }
  }

  async add(req, res) {
    const objs = await this.listarAll();

    let newId;
    if (objs.length == 0) {
      newId = 1;
    } else {
      newId = objs[objs.length - 1].id + 1;
    }

    const newObj = { id: newId, ...req.body };
    objs.push(newObj);

    try {
      await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
      return res.send(newObj);
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async update(req, res) {
    const objs = await this.listarAll();
    const obj = objs.find((o) => o.id == req.params.id);
    if (obj == -1) {
      throw new Error(`Error al actualizar: no se encontró el id ${index}`);
    } else {
      objs[obj.id-1] = {...obj, ...req.body}
      try {
        await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
        return res.send(objs);
      } catch (error) {
        throw new Error(`Error al actualizar: ${error}`);
      }
    }
  }

  async deletes(req , res) {
    const objs = await this.listarAll();
    const index = objs.findIndex((o) => o.id == req.params.id);
    if (index == -1) {
      throw new Error(`Error al borrar: no se encontró el id ${id}`);
    }

    const deleted = objs.splice(index, 1)[0];
    try {
      await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
    return res.send(deleted);
  }

  async borrarAll() {
    try {
      await fs.writeFile(this.ruta, JSON.stringify([], null, 2));
    } catch (error) {
      throw new Error(`Error al borrar todo: ${error}`);
    }
  }
}

export default ContenedorArchivo;
