import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import { roleAdmin } from "../middlewares/roleAcess.js";
import generateProducts from "../utils/generateProducts.js";
const router = Router();

router.get("/", ProductsController.getProductsApi);

router.get("/mockingproducts", (_req,res)=>{

    const products = []

    for (let i = 0; i< 100; i++){
        products.push(generateProducts())
    }

    return res.send({
        status: "sucess",
        payload: products,
      });
})

router.get("/:pid", ProductsController.getProductById);

router.post("/", ProductsController.addProduct);

router.put("/:pid", ProductsController.updateProduct);

router.delete("/:pid", ProductsController.deleteProduct);


export default router;
