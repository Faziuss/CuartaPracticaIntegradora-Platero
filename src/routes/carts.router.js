import { Router } from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const pathName = "./src/data/carts.json";

router.post("/", (req, res) => {
  const newCart = {
    id: uuidv4(),
    products: [],
  };
  fs.readFile(pathName, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Internal server error" });
    }
    const carts = JSON.parse(data);
    carts.push(newCart);

    fs.writeFile(pathName, JSON.stringify(carts), (err) => {
      if (err) {
        return res.status(500).send({ error: "Internal server error" });
      }

      res.send({ status: "sucess", message: "Carrito creado exitosamente" });
    });
  });
});

router.get("/:cid", (req, res) => {
  const cid = req.params.cid;

  fs.readFile(pathName, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Internal server error" });
    }
    const carts = JSON.parse(data);
    const cart = carts.find((cart) => cart.id === cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.send({ status: "sucess", products: cart.products });
  });
});

export default router;