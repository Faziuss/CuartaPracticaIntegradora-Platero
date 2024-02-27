import { Router } from "express";
import Products from "../dao/fileManager/dbManagers/products.js";

const router = Router();
const manager = new Products();

router.get("/", async (_req, res) => {
  const products = await manager.getProducts();

  return res.render("home", { products });
});

router.get("/realTimeProducts", async (_req, res) => {
  const products = await manager.getProducts();

  return res.render("realTimeProducts", { products });
});

export default router;
