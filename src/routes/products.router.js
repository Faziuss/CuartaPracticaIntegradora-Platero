import { Router } from "express";
import fs from "fs";
import { uuid } from "uuidv4";

const router = Router();
const pathName = "./products.json";

router.get("/", (req, res) => {
  fs.readFile(pathName, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: "Internal server error" });
      return;
    }

    const products = JSON.parse(data);
    res.send({ status: "sucess", products: products });
  });
});

router.get("/:pid", (req, res) => {
  const pid = req.params.pid;

  fs.readFile(pathName, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: "Internal server error" });
      return;
    }

    const products = JSON.parse(data);
    const product = products.find(product => product.id == pid)

    if(!product){
        res.status(404).send({error: 'Product not found'})
        return
    }

    res.send({ status: "sucess", products: product });
  });
});

export default router;
