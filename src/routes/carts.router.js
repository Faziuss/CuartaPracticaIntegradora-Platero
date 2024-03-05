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
    res.send({ status: "sucess", cart });
  } catch (error) {
    return next(error);
  }
});

router.post("/:cid/product/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const isCartIDValid = mongoose.Types.ObjectId.isValid(cid);
    if (!isCartIDValid) {
      throw new AppError(400, {
        message: "El ID del carrito ingresado no es válido.",
      });
    }

    const isProductIDValid = mongoose.Types.ObjectId.isValid(pid);
    if (!isProductIDValid) {
      throw new AppError(400, {
        message: "El ID del producto ingresado no es válido.",
      });
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

router.delete("/:cid/product/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const isCartIDValid = mongoose.Types.ObjectId.isValid(cid);
    if (!isCartIDValid) {
      throw new AppError(400, {
        message: "El ID del carrito ingresado no es válido.",
      });
    }

    const isProductIDValid = mongoose.Types.ObjectId.isValid(pid);
    if (!isProductIDValid) {
      throw new AppError(400, {
        message: "El ID del producto ingresado no es válido.",
      });
    }

    await manager.deleteCartProduct(cid, pid);

    res.send({
      status: "sucess",
      message: "Producto elminado exitosamente",
    });
  } catch (error) {
    return next(error);
  }
});

router.put("/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;

    const isCartIDValid = mongoose.Types.ObjectId.isValid(cid);
    if (!isCartIDValid) {
      throw new AppError(400, {
        message: "El ID del carrito ingresado no es válido.",
      });
    }

    await manager.updateAllCartProducts(cid, req.body.products);
    res.send({
      status: "sucess",
      message: "Productos del carrito actualizados con exito",
    });
  } catch (error) {
    return next(error);
  }
});

router.put("/:cid/product/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const body = req.body.quantity;
    console.log(body);
    const isCartIDValid = mongoose.Types.ObjectId.isValid(cid);
    if (!isCartIDValid) {
      throw new AppError(400, {
        message: "El ID del carrito ingresado no es válido.",
      });
    }

    const isProductIDValid = mongoose.Types.ObjectId.isValid(pid);
    if (!isProductIDValid) {
      throw new AppError(400, {
        message: "El ID del producto ingresado no es válido.",
      });
    }

    await manager.updateCartProductQuantity(cid, pid, body);

    res.send({
      status: "sucess",
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const isCartIDValid = mongoose.Types.ObjectId.isValid(cid);
    if (!isCartIDValid) {
      throw new AppError(400, {
        message: "El ID del carrito ingresado no es válido.",
      });
    }
    await manager.deleteAllCartProducts(cid);
    res.send({
      status: "sucess",
      message: "Productos eliminados del carrito exitosamente",
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
