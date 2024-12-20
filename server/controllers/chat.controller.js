import asyncHandler from "express-async-handler";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("userId param not sent with request");
        return res.sendStatus(400);
    }

    // Find an existing chat between the two users
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "username profileImage email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password");
             
            res.status(200).json(fullChat);
        }
        catch (error) {
            console.log("error from accessChat controller", error);
            res.sendStatus(400);
        }
    }
});

const fetchChat = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latesMessage.sender",
                    select: "username profileImage email",
                })
                res.status(200).send(results)
            })
    } catch (error) {
        console.log(error);
        res.status(400)
        throw new Error(error.message)
       
        
    }
})

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "please fill all the fields!" })
    }

    var users = JSON.parse(req.body.users)

    if (users.length < 2) {
        return res.status(400).send("more than 2 users are required for group chat")
    }

    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
        })

        const fullchatGroup = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(fullchatGroup)

    } catch (error) {
        console.log("error from groupchat", error);

        res.status(400).send(error)
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body

    const updatedChatName = await Chat.findByIdAndUpdate(
        chatId, {
        chatName:chatName,
    },
        {
            new: true
        }
    )

        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    
    if (!updatedChatName) {
        res.status(404)
        throw new Error("chat not found")
    } else {
        res.json(updatedChatName)
    }
})

const addToGroup = asyncHandler(async (req, res) => {
    const { userId, chatId } = req.body
    
  try {
      const addUser =await Chat.findByIdAndUpdate(chatId, {
          $push:{users:userId}
      },
        {new :true}  
      )
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
      
      if (!addUser) {
          res.status(404)
          throw new Error("chat not found")
      } else {
          res.json(addUser)
      }
  } catch (error) {
    throw new Error(error)
  }


})

const removeFromGroup = asyncHandler(async (req, res) => {
    const { userId, chatId } = req.body
    
  try {
      const removeUser =await Chat.findByIdAndUpdate(chatId, {
          $pull:{users:userId}
      },
        {new :true}  
      )
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
      
      if (!removeUser) {
          res.status(400)
          throw new Error("chat not found")
      } else {
          res.send(removeUser)
      }
  } catch (error) {
    throw new Error(error)
  }


})


export { accessChat, fetchChat, createGroupChat, renameGroup,addToGroup, removeFromGroup }
