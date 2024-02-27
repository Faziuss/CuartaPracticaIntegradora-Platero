import { Router } from "express";
import Products from "../dao/fileManager/products.js";
import { AppError } from "../helpers/AppError.js";
const router = Router();
const manager = new Products();

router.get("/", async (req, res, next) => {
  try {
    const { limit } = req.query;

    if (limit && (isNaN(limit) || Number(limit) < 0)) {
      throw new AppError(400, { message: "Invalid limit query." });
    }

    const products = await manager.readProducts();

    if (limit) {
      products = products.slice(0, parseInt(limit, 10));
    }
    res.send({ status: "sucess", products: products });
  } catch (error) {
    return next(error);
  }
});

router.get("/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;

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
    return next(error);
  }
});

router.put("/:pid", async (req, res, next) => {
  try {
    const upProd = req.body;
    const { pid } = req.params;

    await manager.updateProduct(pid, upProd);

    res.send({
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

    await manager.deleteProduct(pid);
    io.emit("deleteProduct", pid);
    res.send({
      status: "sucess",
      message: "Producto eliminado existosamente",
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
