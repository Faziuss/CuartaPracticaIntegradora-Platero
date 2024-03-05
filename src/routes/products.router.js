import { Router } from "express";
import Products from "../dao/fileManager/dbManagers/products.js";
import { AppError } from "../helpers/AppError.js";
import mongoose from "mongoose";
const router = Router();
const manager = new Products();

router.get("/", async (req, res, next) => {
  try {
    let products = await manager.getProducts(req.query);

    products.prevLink = products.hasPrevPage ? `${req.protocol}://${req.get('host')}/api/products?page=${products.prevPage}` : null;
    products.nextLink = products.hasNextPage ? `${req.protocol}://${req.get('host')}/api/products?page=${products.nextPage}` : null;


    res.send({ status: "sucess", payload: products });
  } catch (error) {
    return next(error);
  }
});

router.get("/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(pid);
    if (!isValid) {
      throw new AppError(400, { message: "El ID ingresado no es válido." });
    }

    const product = await manager.getProductById(pid);

    if (!product) {
      return res.status(404).send({ error: "Producto no Encontrado" });
    }

    res.send({ status: "sucess", products: product });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const io = req.app.get("io");
    const body = req.body;
    const newProd = await manager.addProduct(body);

    io.emit("newProduct", newProd);

    res.send({ status: "sucess", message: "Nuevo producto agregado" });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
    }
    return next(error);
  }
});

router.put("/:pid", async (req, res, next) => {
  try {
    const upProd = req.body;
    const { pid } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(pid);
    if (!isValid) {
      throw new AppError(400, { message: "El ID ingresado no es válido." });
    }

    const product = await manager.updateProduct(pid, upProd);
    if (!product) {
      throw new AppError(404, { message: "Producto no encontrado." });
    }

    return res.send({
      status: "sucess",
      message: "Producto actualizado correctamente",
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:pid", async (req, res, next) => {
  try {
    const io = req.app.get("io");
    const { pid } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(pid);
    if (!isValid) {
      throw new AppError(400, { message: "El ID ingresado no es válido." });
    }

    const product = await manager.deleteProduct(pid);
    if (product.deletedCount === 0) {
      throw new AppError(404, { message: "Producto no encontrado." });
    }
    io.emit("deleteProduct", pid);

    return res
      .status(200)
      .json({ message: "Producto eliminado exitosamente." });
  } catch (error) {
    return next(error);
  }
});

export default router;
