import fs from "fs";
import { v4 as uuidv4 } from "uuid";

class Products {
  constructor() {
    this.path = "./src/dao/fileManager/files/products.json";
  }

  validateAddProduct = (newProd) => {
    const allowedFields = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "thumbnails",
    ];
    const fields = Object.keys(newProd);
    const disallowedFields = fields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (disallowedFields.length > 0) {
      throw new AppError(400, {
        message: `Los siguientes campos NO estan permitidos: ${disallowedFields.join(
          ", "
        )}`,
      });
    }

    if (
      !newProd.title ||
      !newProd.description ||
      !newProd.code ||
      !newProd.price ||
      !newProd.stock ||
      !newProd.category
    ) {
      throw new AppError(400, {
        message:
          "Los campos title, description, code, price, stock, category SON OBLIGATORIOS",
      });
    }

    if (newProd.status == undefined) {
      newProd.status = true;
    }

    if (
      typeof newProd.title !== "string" ||
      typeof newProd.description !== "string" ||
      typeof newProd.code !== "string" ||
      isNaN(newProd.price) ||
      typeof newProd.status !== "boolean" ||
      isNaN(newProd.stock) ||
      typeof newProd.category !== "string"
    ) {
      throw new AppError(400, {
        message: "Algunos campos tienen un dato invalido",
      });
    }

    newProd.id = uuidv4();

    return newProd;
  };

  addProduct = async (body) => {
    const product = this.validateAddProduct(body);

    const products = await this.readProducts();

    const foundProduct = products.find((p) => p.code === product.code);
    if (foundProduct) {
      throw new AppError(400, {
        message: "El codigo identificador ya se encuentra en uso.",
      });
    }

    products.push(product);

    const json = JSON.stringify(products, null, 2);
    await fs.promises.writeFile(this.path, json);

    return product;
  };

  readProducts = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } else {
      return [];
    }
  };

  getProducts = () => {
    const products = this.readProducts();
    console.log(products);
  };

  getProductById = async (id) => {
    const products = await this.readProducts();
    const foundProduct = products.find((product) => product.id === id);
    return foundProduct;
  };

  validateUpdateProduct = async (upProd) => {
    const allowedFields = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "thumbnails",
    ];
    const fields = Object.keys(upProd);
    const disallowedFields = fields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (disallowedFields.length > 0) {
      throw new AppError(400, {
        message: `Los siguientes campos son inexistentes para la actualización: ${disallowedFields.join(
          ", "
        )}`,
      });
    }
  };

  updateProduct = async (pid, upProd) => {
    this.validateUpdateProduct(upProd);

    const products = await this.readProducts();

    const i = products.findIndex((product) => product.id == pid);

    if (i === -1) {
      throw new AppError(404, { message: "Producto no encontrado." });
    }

    if (upProd.code) {
      const foundCode = products.some((p) => {
        return p.code === upProd.code && p.id !== products[i].id;
      });

      if (foundCode) {
        throw new AppError(404, {
          message: "El codigo identificador ya se encuentra en uso",
        });
      }
    }

    products[i] = { ...products[i], ...upProd };

    const json = JSON.stringify(products, null, 2);

    await fs.promises.writeFile(this.path, json);
  };

  deleteProduct = async (pid) => {
    const products = await this.readProducts();

    const i = products.findIndex((product) => product.id == pid);

    if (i === -1) {
      throw new AppError(404, { error: "Producto no encontrado" });
    }

    products.splice(i, 1);

    const json = JSON.stringify(products, null, 2);
    await fs.promises.writeFile(this.path, json);
  };
}

export default Products;
