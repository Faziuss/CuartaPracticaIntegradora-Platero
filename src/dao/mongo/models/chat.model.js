import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
     timestamp:{
        type: String,
        default: new Date().toLocaleTimeString()
    } 
})

const ChatModel = mongoose.model("messages", chatSchema)

export default ChatModel