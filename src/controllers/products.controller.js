import ProductService from "../services/products.service.js"
import mongoose from "mongoose";
import { AppError } from "../helpers/AppError.js";

const productService = new ProductService()

class ProductsController{
    static async getProductsApi(req,res,next){
       try {
            let products = await productService.getProductsApi(req.query);
        
            products.prevLink = products.hasPrevPage ? `${req.protocol}://${req.get('host')}/api/products?page=${products.prevPage}` : null;
            products.nextLink = products.hasNextPage ? `${req.protocol}://${req.get('host')}/api/products?page=${products.nextPage}` : null;
        
        
            res.send({ status: "sucess", products });
          } catch (error) {
            return next(error);
          }
    }
    static async getProductById(req,res,next){
        try {
            const { pid } = req.params;
            const isValid = mongoose.Types.ObjectId.isValid(pid);
            if (!isValid) {
              throw new AppError(400, { message: "El ID ingresado no es válido." });
            }
        
            const product = await productService.getProductById(pid);
        
            res.send({ status: "sucess", products: product });
          } catch (error) {
            return next(error);
          }
    }
    static async addProduct(req,res,next){
        try {
            const io = req.app.get("io");
            const body = req.body;
            const newProd = await productService.addProduct(body);
        
            io.emit("newProduct", newProd);
        
            res.send({ status: "sucess", message: "Nuevo producto agregado" });
          } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
            }
            return next(error);
          }
    }
    static async updateProduct(req,res,next){
        try {
            const upProd = req.body;
            const { pid } = req.params;
            const isValid = mongoose.Types.ObjectId.isValid(pid);
            if (!isValid) {
              throw new AppError(400, { message: "El ID ingresado no es válido." });
            }
        
            await productService.updateProduct(pid, upProd);
        
            return res.send({
              status: "sucess",
              message: "Producto actualizado correctamente",
            });
          } catch (error) {
            return next(error);
          }
    }
    static async deleteProduct(req,res,next){
        try {
            const io = req.app.get("io");
            const { pid } = req.params;
            const isValid = mongoose.Types.ObjectId.isValid(pid);
            if (!isValid) {
              throw new AppError(400, { message: "El ID ingresado no es válido." });
            }
        
            const product = await productService.deleteProduct(pid);
            if (product.deletedCount === 0) {
              throw new AppError(404, { message: "Producto no encontrado." });
            }
            io.emit("deleteProduct", pid);
        
            return res
              .status(200)
              .json({ message: "Producto eliminado exitosamente." });
          } catch (error) {
            return next(error);
          }
    }
}

export default ProductsController