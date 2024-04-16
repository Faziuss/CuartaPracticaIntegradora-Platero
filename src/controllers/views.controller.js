import ProductService from "../services/products.service.js";
import CartService from "../services/carts.service.js";

const productService = new ProductService();
const cartService = new CartService();

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

    const result = await cartService.getCartById(cid);

    const carts = result.products;

    return res.render("carts", { carts: carts.map((item) => item.toJSON()) });
  }
  static async register(_req, res) {
    res.render("register");
  }
  static async login(_req, res) {
    res.render("login");
  }
}

export default ViewsController;
