import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: String,
    default: new Date().toLocaleTimeString(),
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: { type: String, required: true },
});

const TicketModel = mongoose.model("ticket", TicketSchema)
export default TicketModel