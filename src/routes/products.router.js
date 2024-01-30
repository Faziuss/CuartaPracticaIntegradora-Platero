import { Router } from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const pathName = "./src/data/products.json";

router.get("/", (req, res) => {
  fs.readFile(pathName, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal server error" });
    }

    const products = JSON.parse(data);
    const limit = req.query.limit;

    if (limit) {
      products = products.slice(0, parseInt(limit, 10));
    }
    res.send({ status: "sucess", products: products });
  });
});

router.get("/:pid", (req, res) => {
  const pid = req.params.pid;

  fs.readFile(pathName, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Internal server error" });
    }

    const products = JSON.parse(data);
    const product = products.find((product) => product.id == pid);

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send({ status: "sucess", products: product });
  });
});

router.post("/", (req, res) => {
  const newProd = req.body;

  const allowedFields = [
    "title",
    "description",
    "code",
    "price",
    "status",
    "stock",
    "category",
    "thumbnails",
  ];
  const fields = Object.keys(newProd);
  const disallowedFields = fields.filter(
    (field) => !allowedFields.includes(field)
  );

  console.log(disallowedFields);

  if (disallowedFields.length > 0) {
    return res.status(400).send({
      error: `Los siguientes campos NO estan permitidos: ${disallowedFields.join(
        ", "
      )}`,
    });
  }

  if (
    !newProd.title ||
    !newProd.description ||
    !newProd.code ||
    !newProd.price ||
    !newProd.stock ||
    !newProd.category
  ) {
    return res.status(400).send({
      error:
        "Los campos title, description, code, price, stock, category SON OBLIGATORIOS",
    });
  }

  if (newProd.status == undefined) {
    newProd.status = true;
  }
  newProd.id = uuidv4();

  fs.readFile(pathName, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Internal server error" });
    }

    const products = JSON.parse(data);
    products.push(newProd);

    fs.writeFile(pathName, JSON.stringify(products), (err) => {
      if (err) {
        return res.status(500).send({ error: "Internal server error" });
      }

      res.send({ status: "sucess", message: "Nuevo producto agregado" });
    });
  });
});

router.put("/:pid", (req, res) => {
  const upProd = req.body;
  const pid = req.params.pid;

  const allowedFields = [
    "title",
    "description",
    "code",
    "price",
    "status",
    "stock",
    "category",
    "thumbnails",
  ];
  const fields = Object.keys(upProd);
  const disallowedFields = fields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (disallowedFields.length > 0) {
    return res.status(400).send({
      error: `Los siguientes campos son inexistentes para la actualización: ${disallowedFields.join(
        ", "
      )}`,
    });
  }

  fs.readFile(pathName, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Internal server error" });
    }

    const products = JSON.parse(data);

    const i = products.findIndex((product) => product.id == pid);

    if (i === -1) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    products[i] = { ...products[i], ...upProd };

    fs.writeFile(pathName, JSON.stringify(products), (err) => {
      if (err) {
        return res.status(500).send({ error: "Internal server error" });
      }

      res.send({
        status: "sucess",
        message: "Producto actualizado correctamente",
      });
    });
  });
});

export default router;

router.delete("/:pid", (req, res) => {
  const pid = req.params.pid;

  fs.readFile(pathName, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Internal server error" });
    }

    const products = JSON.parse(data);

    const i = products.findIndex((product) => product.id == pid);

    if (i === -1) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    products.splice(i, 1);

    fs.writeFile(pathName, JSON.stringify(products), (err) => {
      if (err) {
        return res.status(500).send({ error: "Internal server error" });
      }

      res.send({
        status: "sucess",
        message: "Producto eliminado existosamente",
      });
    });
  });
});
