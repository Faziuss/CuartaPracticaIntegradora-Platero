import { Router } from "express";
import Carts from "../dao/fileManager/dbManagers/carts.js";
import mongoose from "mongoose";
import { AppError } from "../helpers/AppError.js";

const manager = new Carts();
const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const newCart = await manager.createCart();

    return res.status(200).json({
      status: "sucess",
      message: "Carrito creado exitosamente",
      id: newCart.id,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(cid);
    if (!isValid) {
      throw new AppError(400, { message: "El ID ingresado no es válido." });
    }
    const cart = await manager.getCartById(cid);
    if (!cart) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }
    res.send({ status: "sucess", products: cart.products });
  } catch (error) {
    return next(error);
  }
});

router.post("/:cid/product/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const isCartIDValid = mongoose.Types.ObjectId.isValid(cid);
    if (!isCartIDValid) {
      throw new AppError(400, { message: "El ID del carrito ingresado no es válido." });
    }

    const isProductIDValid = mongoose.Types.ObjectId.isValid(pid);
    if (!isProductIDValid) {
      throw new AppError(400, { message: "El ID del producto ingresado no es válido." });
    }

    await manager.addProductToCart(cid, pid);

    res.send({
      status: "sucess",
      message: "Producto agregado exitosamente al carrito",
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
