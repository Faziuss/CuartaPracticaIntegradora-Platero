import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  roles: {
    type: String,
    default: "Usuario",
  },
  cart: {
      type: Schema.Types.ObjectId,
      ref: "carts",
      required: true,
    }
  });

const userModel = mongoose.model("users", userSchema);

export default userModel;
