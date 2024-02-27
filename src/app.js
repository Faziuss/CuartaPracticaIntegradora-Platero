import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middlewares/errorHandler.js";
const port = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/dao`));

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);
app.use(errorHandler);

const httpServer = app.listen(port, () =>
  console.log(`Running on port ${port}`)
);

const io = new Server(httpServer);
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`cliente conectado, id ${socket.id}`);
});
