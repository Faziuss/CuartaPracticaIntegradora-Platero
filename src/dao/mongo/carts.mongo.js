import { AppError } from "../../helpers/AppError.js";
import CartModel from "./models/carts.model.js";
import ProductModel from "./models/products.model.js";

class Carts {
  constructor() {}

  async createCart() {
    const newCart = { products: [] };

    let cart = await CartModel.create(newCart);
    console.log(cart);
    return cart;
  }

  async getCartById(cid) {
    const cart = await CartModel.findById(cid).populate("products.product");

    return cart;
  }

  async addProductToCart(cid, pid) {
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

    if (product.stock <= 0) {
      console.log("Producto sin Stock");
      throw new AppError(404, {
        message: "Producto sin Stock",
      });
    }

    const productInCart = cart.products.find((p) => {
      return p.product.toString() == pid;
    });

    if (productInCart) {
      await CartModel.updateOne(
        { _id: cid, "products.product": productInCart.product },
        {
          $inc: {
            "products.$.quantity": 1,
          },
        }
      );
    } else {
      await CartModel.updateOne(
        { _id: cid },
        {
          $push: {
            products: {
              product: product._id,
              quantity: 1,
            },
          },
        }
      );
    }
  }

  async deleteCartProduct(cid, pid) {
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

    const result = await CartModel.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );

    console.log(result);

    if (result.modifiedCount === 0) {
      throw new AppError(404, {
        message: "Producto no encontrado en el carrito.",
      });
    }
  }

  async updateAllCartProducts(cid, products) {
    for (const product of products) {
      const allowedFields = ["product", "quantity"];
      const fields = Object.keys(product);
      const disallowedFields = fields.filter(
        (field) => !allowedFields.includes(field)
      );

      if (disallowedFields.length > 0) {
        throw new AppError(400, {
          message: `Los siguientes campos NO están permitidos en el producto con ID ${
            product.id
          }: ${disallowedFields.join(", ")}`,
        });
      }
    }
    const result = await CartModel.updateOne(
      {
        _id: cid,
      },
      { $set: { products: products } }
    );

    if (result.matchedCount === 0) {
      throw new AppError(404, {
        message: "El ID del carrito ingresado no se encontro o no existe",
      });
    }
  }

  async updateCartProductQuantity(cid, pid, body) {
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

    const result = await CartModel.updateOne(
      { _id: cid, "products.product": pid },
      { $set: { "products.$.quantity": body } }
    );

    if (result.matchedCount === 0) {
      throw new AppError(404, {
        message: "Producto no encontrado en el carrito.",
      });
    }
  }

  async deleteAllCartProducts(cid) {
    const result = await CartModel.updateOne(
      { _id: cid },
      { $set: { products: [] } }
    );

    if (result.matchedCount === 0) {
      throw new AppError(404, {
        message: "El ID del carrito ingresado no existe",
      });
    }
  }

  async purchase(cid, email) {
    const cart = await CartModel.findById(cid);
    const cartProducts = cart.products;
    const totalAmount = 0;
    const remainProducts = [];
    cartProducts.forEach(async (p) => {
      if (p.product.stock <= p.quantity) {
        await ProductModel.updateOne(
          { _id: p.product._id },
          { $inc: { stock: -p.product.stock } }
        );
        const result = await CartModel.updateOne(
          { _id: cid },
          { $pull: { products: { product: p.product._Id } } }
        );

        console.log(result);

        if (result.modifiedCount === 0) {
          throw new AppError(404, {
            message: "Producto no encontrado en el carrito.",
          });
        }
        totalAmount += p.quantity * p.product.price;
      } else {
        remainProducts.push(p.product._id);
      }

      if (totalAmount > 0) {
        await this.ticketService.generate(email, totalAmount);
      }
      return remainProducts;
    });
  }
}

export default Carts;
