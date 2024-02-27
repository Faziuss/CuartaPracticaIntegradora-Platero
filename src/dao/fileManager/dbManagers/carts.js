import { AppError } from "../../../helpers/AppError.js";
import CartModel from "../models/carts.model.js";
import ProductModel from "../models/products.model.js";

class Carts {
  constructor() {}

  createCart = async () => {
    const newCart = { products: [] };

    let cart = await CartModel.create(newCart);
    console.log(cart);
    return cart;
  };

  getCartById = async (id) => {
    const cart = await CartModel.findById(id);
    return cart;
  };

  addProductToCart = async (cid, pid) => {
    const product = await ProductModel.findById(pid);
    if (!product) {
      throw new AppError(404, {
        message: "El producto con el ID ingresado no existe.",
      });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      throw new AppError(404, {
        message: "El carrito con el ID ingresado no existe.",
      });
    }

    const productInCart = cart.products.find((p) => {
      return p.id === pid;
    });

    if (productInCart) {
      console.log("product in cart");
      await CartModel.updateOne({_id: cid, "products._id": productInCart._id}, {
        $inc : {
          "products.$.quantity": 1
        }
      })
    } else {
      await CartModel.updateOne(
        { _id: cid },
        {
          $push: {
            products: {
              id: product._id,
              quantity: 1,
            },
          },
        }
      );
    }
  };
}

export default Carts;
