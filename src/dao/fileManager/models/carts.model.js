import mongoose, { Schema } from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "products", required: true },
      quantity: Number,
    },
  ],
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;
