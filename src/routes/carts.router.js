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
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    res.send({ status: "sucess", products: cart.products });
  });
});

router.post("/:cid/product/:pid", (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  fs.readFile(pathName, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Internal server error" });
    }
    const carts = JSON.parse(data);

    const cartIndex = carts.findIndex((cart) => cart.id === cid);

    if (cartIndex === -1) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const existingProductIndex = carts[cartIndex].products.findIndex(
      (product) => product.id === pid
    );

    if (existingProductIndex !== -1) {
      carts[cartIndex].products[existingProductIndex].quantity++;
    } else {
      carts[cartIndex].products.push({ id: pid, quantity: 1 });
    }

    fs.writeFile(pathName, JSON.stringify(carts), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal server error" });
      }

      res.send({
        status: "sucess",
        message: "Producto agregado exitosamente al carrito",
      });
    });
  });
});

export default router;
