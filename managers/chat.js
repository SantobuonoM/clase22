import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Chat {
  constructor(fileName) {
    this.pathToChat = resolve(__dirname, fileName);
    this.messages = [];
  }

  async getMessages() {
    try {
      this.messages = await fs.promises.readFile(this.pathToChat, "utf-8");
      if (!this.messages) {
        const arrayMessages = [];
        fs.writeFileSync(this.pathToChat, JSON.stringify(arrayMessages));
        return arrayMessages;
      }
      const datos = JSON.parse(this.messages);
      return datos;
    } catch (error) {
      throw error;
    }
  }

  async saveMessages(obj) {
    try {
      const array = await this.getMessages();
      array.push(obj);
      const data = JSON.stringify(array, null, 2);
      fs.writeFileSync(this.pathToChat, data, "utf-8");
      return obj;
    } catch (error) {
      throw error;
    }
  }
}
