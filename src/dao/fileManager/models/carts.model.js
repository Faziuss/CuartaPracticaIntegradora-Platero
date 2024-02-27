import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      id: { type: String, ref: "Product", required: true },
      quantity: Number,
    },
  ],
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;
