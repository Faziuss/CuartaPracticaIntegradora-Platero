import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String, 
    unique:true
  },
  age: Number,
  password: String,
  roles: {
    type: String,
    default: "Usuario",
  },
  cart: {
      type: Schema.Types.ObjectId,
      ref: "carts",
    }
  });

const userModel = mongoose.model("users", userSchema);

export default userModel;
