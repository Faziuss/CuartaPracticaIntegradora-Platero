import { Router } from "express";
import Products from "../dao/fileManager/dbManagers/products.js";
import { AppError } from "../helpers/AppError.js";
import mongoose from "mongoose";
import ProductsController from "../controllers/products.controller.js";
const router = Router();
const manager = new Products();

router.get("/", ProductsController.getProductsApi);

router.get("/:pid", ProductsController.getProductById);

router.post("/", ProductsController.addProduct);

router.put("/:pid", ProductsController.updateProduct);

router.delete("/:pid", ProductsController.deleteProduct);

export default router;
