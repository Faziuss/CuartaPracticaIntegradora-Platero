import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import { checkRole } from "../middlewares/roleAcess.js";
import generateProducts from "../utils/generateProducts.js";
const router = Router();

router.get("/", ProductsController.getProductsApi);

router.get("/mockingproducts", (_req, res) => {
  const products = [];

  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }

  return res.send({
    status: "sucess",
    payload: products,
  });
});

router.get("/:pid", ProductsController.getProductById);

router.post(
  "/",
  checkRole(["Usuario", "Premium"]),
  ProductsController.addProduct
);

router.put(
  "/:pid",
  checkRole(["Usuario", "Premium"]),
  ProductsController.updateProduct
);

router.delete(
  "/:pid",
  checkRole(["Usuario", "Premium"]),
  ProductsController.deleteProduct
);

export default router;
