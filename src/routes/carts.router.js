import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";
import { checkRole } from "../middlewares/roleAcess.js";

const router = Router();

router.post("/", CartsController.createCart);

router.get("/:cid", CartsController.getCartById);

router.post(
  "/:cid/product/:pid",
  checkRole(["Usuario", "Premium"]),
  CartsController.addProductToCart
);

router.delete("/:cid/product/:pid", CartsController.deleteCartProduct);

router.put("/:cid", CartsController.updateAllCartProducts);

router.put("/:cid/product/:pid", CartsController.updateCartProductQuantity);

router.delete("/:cid", CartsController.deleteAllCartProducts);

router.post("/:cid/purchase", CartsController.purchase);

export default router;
