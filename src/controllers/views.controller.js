import {
  productService,
  cartService,
  ticketService,
} from "../repositories/index.js";
import jwt from 'jsonwebtoken'
import { jwtSecret } from "../config/config.js";

class ViewsController {
  static async getHomeProducts(_req, res) {
    const products = await productService.getProducts();

    return res.render("home", { products });
  }

  static async getRealTimeProducts(_req, res) {
    const products = await productService.getProducts();

    return res.render("realTimeProducts", { products });
  }

  static async chat(_req, res) {
    return res.render("chat", {});
  }

  static async getProducts(req, res) {
    const { docs, ...rest } = await productService.getProductsApi(req.query);

    const products = docs;

    return res.render("products", {
      products,
      ...rest,
      user: req.session.user,
    });
  }
  static async getCart(req, res) {
    const { cid } = req.params;

    const cart = await cartService.getCartById(cid);

    return res.render("carts", { cart });
  }

  static async getTicketByEmail(req, res) {
    const email = req.session.user.email;
    const tickets = await ticketService.getTicketByEmail(email);

    console.log("email", email, "tickets", tickets);

    return res.render("tickets", { tickets });
  }
  static async register(_req, res) {
    res.render("register");
  }
  static async login(_req, res) {
    res.render("login");
  }

  static async getPasswordResetForm(req, res) {
    try {
      res.render("reset-password", { user: {} });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static getPasswordChangeForm(req, res) {
    try {
      const {token} = req.params
      const decoded = jwt.verify(token, jwtSecret);
      return res.render("change-password", { user: {decoded}, token });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }
}

export default ViewsController;
