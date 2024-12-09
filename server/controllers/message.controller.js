import asyncHandler from "express-async-handler";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";

// Send message function
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    // Check if content and chatId are provided
    if (!content || !chatId) {
        console.log("Invalid data passed");
        return res.status(400).json({ message: "Content and chatId are required" });
    }

    // Create a new message
    const newMessage = {
        sender: req.user._id,
        content,
        chat: chatId,
       
    };

    try {
        // Create the new message
        let message = await Message.create(newMessage);

        // Populate sender, chat, and users in one go
        message = await message.populate([
            { path: "sender", select: "username profileImage" },
            { path: "chat" },
            { path: "chat.users", select: "username profileImage email" },

        ]);

        // Update the latest message in the chat
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        // Return the populated message
        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message || "An error occurred while sending the message" });
    }
});

// Get all messages in a chat
const allMessages = asyncHandler(async (req, res) => {
    try {
        // Find all messages for the given chat
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "username profileImage email")
            .populate("chat");

        res.json(messages); 
    } catch (error) {
        res.status(400).json({ message: error.message || "An error occurred while fetching messages" });
    }
});

export { sendMessage, allMessages };

