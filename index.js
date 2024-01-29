import app from "./src/app.js";

app.listen(
  app.get("PORT") || 8080,
  () => {
    console.log("Servidor listo y corriendo en el puerto 8080");
  }
);