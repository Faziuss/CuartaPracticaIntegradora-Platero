import Products from "../dao/fileManager/dbManagers/products.js";
import { AppError } from "../helpers/AppError.js";

class ProductService {
    constructor() {
      this.dao = new Products();
    }

    async getProducts(){
        return await this.dao.getProducts()
    }

    async getProductsApi(query){
        return await this.dao.getProductsApi(query);
    }

    async getProductById(pid){
        const product = await this.dao.getProductById(pid);
        
        if (!product) {
            throw new AppError(404,{ message: "Producto no Encontrado" });
        }
        return product
    }
    async addProduct(body){
        return this.dao.addProduct(body);
    }
    async updateProduct(pid, upProd){
        const product = await this.dao.updateProduct(pid, upProd);
            if (!product) {
              throw new AppError(404, { message: "Producto no encontrado." });
            }
    }
    async deleteProduct(pid){
        return await this.dao.deleteProduct(pid);
    }
}

export default ProductService