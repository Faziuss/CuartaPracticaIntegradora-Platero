import Carts from "../dao/fileManager/mongo/carts.mongo";
import Products from "../dao/fileManager/mongo/products.mongo";

export const cartService = new cartService(new Carts())
export const productService = new productService(new Products())