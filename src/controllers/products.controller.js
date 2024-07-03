import { productService } from "../repositories/index.js";
import mongoose from "mongoose";
import CustomError from "../utils/CustomError.js";
import { getInvalidIdTypeInfo } from "../utils/info.js";
import ErrorTypes from "../utils/ErrorTypes.js";

class ProductsController {
  static async getProductsApi(req, res, next) {
    try {
      let products = await productService.getProductsApi(req.query);

      products.prevLink = products.hasPrevPage
        ? `${req.protocol}://${req.get("host")}/api/products?page=${
            products.prevPage
          }`
        : null;
      products.nextLink = products.hasNextPage
        ? `${req.protocol}://${req.get("host")}/api/products?page=${
            products.nextPage
          }`
        : null;

      res.send({ status: "sucess", products });
    } catch (error) {
      return next(error);
    }
  }
  static async getProductById(req, res, next) {
    try {
      const { pid } = req.params;
      const isValid = mongoose.Types.ObjectId.isValid(pid);
      if (!isValid) {
        throw new CustomError({
          name: "Invalid id type error",
          cause: getInvalidIdTypeInfo(pid),
          message: "El tipo de ID ingresado no es valido",
          code: ErrorTypes.INVALID_ID_TYPE_ERROR,
        });
      }

      const product = await productService.getProductById(pid);

      res.send({ status: "sucess", products: product });
    } catch (error) {
      return next(error);
    }
  }
  static async addProduct(req, res, next) {
    try {
      const io = req.app.get("io");
      const body = req.body;
      const user = req.session.user;
      if (user.roles == "Premium") {
        body.owner = user.email;
      }
      const newProd = await productService.addProduct(body);

      io.emit("newProduct", newProd);

      res.send({ status: "sucess", message: "Nuevo producto agregado" });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
      }
      return next(error);
    }
  }
  static async updateProduct(req, res, next) {
    try {
      const upProd = req.body;
      const { pid } = req.params;
      const isValid = mongoose.Types.ObjectId.isValid(pid);
      if (!isValid) {
        throw new CustomError({
          name: "Invalid id type error",
          cause: getInvalidIdTypeInfo(pid),
          message: "El tipo de ID ingresado no es valido",
          code: ErrorTypes.INVALID_ID_TYPE_ERROR,
        });
      }

      await productService.updateProduct(pid, upProd);

      return res.send({
        status: "sucess",
        message: "Producto actualizado correctamente",
      });
    } catch (error) {
      return next(error);
    }
  }
  static async deleteProduct(req, res, next) {
    try {
      const io = req.app.get("io");
      const { pid } = req.params;
      const isValid = mongoose.Types.ObjectId.isValid(pid);
      if (!isValid) {
        throw new CustomError({
          name: "Invalid id type error",
          cause: getInvalidIdTypeInfo(pid),
          message: "El tipo de ID ingresado no es valido",
          code: ErrorTypes.INVALID_ID_TYPE_ERROR,
        });
      }
      const product = await productService.getProductById(pid);
      if (
        req.session.user.roles == "Premium" &&
        product.owner != req.session.user.email
      ) {
        throw new Error(`No puedes eliminar un producto que no te pertence.`);
      }

      if(product.owner && product.owner != "Admin"){
        await mailingService.sendDeletedPremiumMail(product.owner, product.name)
      }

      await productService.deleteProduct(pid);
      io.emit("deleteProduct", pid);

      return res
        .status(200)
        .json({ message: "Producto eliminado exitosamente." });
    } catch (error) {
      return next(error);
    }
  }
}

export default ProductsController;
