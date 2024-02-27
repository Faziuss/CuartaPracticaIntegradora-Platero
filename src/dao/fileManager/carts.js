import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../helpers/AppError.js";

class Carts {
  constructor() {
    this.path = "./src/dao/fileManager/files/carts.json";
  }
  readCart = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const cart = JSON.parse(data);
      return cart;
    } else {
      return [];
    }
  }

  createCart = async () => {
    const newCart = {
      id: uuidv4(),
      products: [],
    };

    const cart = await this.readCart();
    cart.push(newCart);

    const json = JSON.stringify(cart, null, 2);
    await fs.promises.writeFile(this.path, json);

    return newCart
  };

  getCartById = async (id) => {
    const carts = await this.readCart();
    const foundCart = carts.find((cart) => {
      return cart.id === id;
    });
    return foundCart;
  };

  addProductToCart = async (cid, pid) => {

    const carts = await this.readCart()

    const cartIndex = carts.findIndex((cart) => cart.id === cid);

    if (cartIndex === -1) {
      throw new AppError(404, { message: "Carrito no encontrado" });
    }

    const existingProductIndex = carts[cartIndex].products.findIndex(
      (product) => product.id === pid
    );

    if (existingProductIndex !== -1) {
      carts[cartIndex].products[existingProductIndex].quantity++;
    } else {
      carts[cartIndex].products.push({ id: pid, quantity: 1 });
    }

    const json = JSON.stringify(carts, null, 2);
    await fs.promises.writeFile(this.path, json);

  }

}

export default Carts
