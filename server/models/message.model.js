import mongoose from "mongoose"

const msgSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content: {
        type: String,
        trim:true
    },

    chat:{
    type: mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    },
    
    readBy:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}]
}, {timestamps:true})

const Message = new mongoose.model("Message", msgSchema)

export default Message