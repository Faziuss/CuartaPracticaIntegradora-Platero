import Carts from "../dao/mongo/carts.mongo.js";
import Products from "../dao/mongo/products.mongo.js"
import CartService from "../services/carts.service.js";
import ProductService from "../services/products.service.js";

export const cartService = new CartService(new Carts())
export const productService = new ProductService(new Products())