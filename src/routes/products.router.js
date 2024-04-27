import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import { roleAdmin } from "../middlewares/roleAcess.js";
const router = Router();

router.get("/", ProductsController.getProductsApi);

router.get("/:pid", ProductsController.getProductById);

router.post("/", roleAdmin, ProductsController.addProduct);

router.put("/:pid", roleAdmin, ProductsController.updateProduct);

router.delete("/:pid", roleAdmin, ProductsController.deleteProduct);

export default router;
