import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middlewares/errorHandler.js";
import mongoose from "mongoose";
import ChatModel from "./dao/fileManager/models/chat.model.js";
const port = 8080;

mongoose
  .connect(
    `mongodb+srv://fabriplatero88:2iVDli30FRtzgWqO@cluster-coder.urrltm6.mongodb.net/ecommerce`
  )
  .then(() => {
    console.log("Connected successfully");
  });

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

const getMessages = async () => {
  let messages = await ChatModel.find().lean();
  return messages;
};

const io = new Server(httpServer);
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`cliente conectado, id ${socket.id}`);

  socket.on("userMessage", async (messageData) => {
    try {
      console.log("mensaje", messageData);
      const newMessage = new ChatModel({
        user: messageData.user,
        message: messageData.message,
      });
      await newMessage.save();
      let messages = await getMessages();
      io.emit("messages", { messages });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("authenticated", async ({ userEmail }) => {
    let messages = await getMessages();
    socket.emit("messages", { messages });
    socket.broadcast.emit("newUser", { newUserEmail: userEmail });
  });
});
