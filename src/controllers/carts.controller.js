import mongoose from "mongoose";
import CartService from "../services/carts.service.js";
import { AppError } from "../helpers/AppError.js";
mongoose;

const cartService = new CartService();

class CartsController {
  static async createCart(req, res, next) {
    try {
      const newCart = await cartService.createCart();

      return res.status(200).json({
        status: "sucess",
        message: "Carrito creado exitosamente",
        id: newCart.id,
      });
    } catch (error) {
      return next(error);
    }
  }
  static async getCartById(req, res, next) {
    try {
      const { cid } = req.params;
      const isValid = mongoose.Types.ObjectId.isValid(cid);
      if (!isValid) {
        throw new AppError(400, { message: "El ID ingresado no es válido." });
      }
      const cart = await cartService.getCartById(cid);
      res.send({ status: "sucess", cart });
    } catch (error) {
      return next(error);
    }
  }
  static async addProductToCart(req, res, next) {
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

      if (req.session.user.cart !== cid) {
        throw new AppError(400, {
          message:
            "El carrito que intentas modificar no coincide con el id del carrito del usuario",
        });
      }

      await cartService.addProductToCart(cid, pid);

      res.send({
        status: "sucess",
        message: "Producto agregado exitosamente al carrito",
      });
    } catch (error) {
      return next(error);
    }
  }
  static async deleteCartProduct(req, res, next) {
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

      await cartService.deleteCartProduct(cid, pid);

      res.send({
        status: "sucess",
        message: "Producto elminado exitosamente",
      });
    } catch (error) {
      return next(error);
    }
  }
  static async updateAllCartProducts(req, res, next) {
    try {
      const { cid } = req.params;

      const isCartIDValid = mongoose.Types.ObjectId.isValid(cid);
      if (!isCartIDValid) {
        throw new AppError(400, {
          message: "El ID del carrito ingresado no es válido.",
        });
      }

      await cartService.updateAllCartProducts(cid, req.body);
      res.send({
        status: "sucess",
        message: "Productos del carrito actualizados con exito",
      });
    } catch (error) {
      return next(error);
    }
  }
  static async updateCartProductQuantity(req, res, next) {
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

      await cartService.updateCartProductQuantity(cid, pid, body);

      res.send({
        status: "sucess",
        message: "Producto actualizado exitosamente",
      });
    } catch (error) {
      return next(error);
    }
  }
  static async deleterAllCartProducts(req, res, next) {
    try {
      const { cid } = req.params;
      const isCartIDValid = mongoose.Types.ObjectId.isValid(cid);
      if (!isCartIDValid) {
        throw new AppError(400, {
          message: "El ID del carrito ingresado no es válido.",
        });
      }
      await cartService.deleteAllCartProducts(cid);
      res.send({
        status: "sucess",
        message: "Productos eliminados del carrito exitosamente",
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default CartsController;
