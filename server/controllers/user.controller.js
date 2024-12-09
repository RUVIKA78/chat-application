import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import generatedToken from "../utils/token.js"

const register = asyncHandler(async (req, res) => {
    const { username, email, password, profileImage } = req.body

    if (!username || !email || !password) {
        res.status(400)
        throw new Error("please enter all the details")
    }
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("email already exists")
    }

    const createdUser = await User.create({
        username,
        email,
        password,
        profileImage
    })


    if (createdUser) {
        res.status(200).json({
            _id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
            isAdmin:createdUser.isAdmin,
            token: generatedToken(createdUser._id),
            profileImage:createdUser.profileImage.toString()
        })
        // console.log(generatedToken);
    }
    else {
        res.status(400)
        throw new Error("failed to create a new user")
    }


})

const login =asyncHandler (async (req,res) => {
    const { email, password } = req.body
    const user = await  User.findOne({ email })
    
    // console.log(await user.matchPassword(password))

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            isAdmin:user.isAdmin,
            token: generatedToken(user._id),
message:"login successful"

        })

    }

    else {
        res.status(400)
        throw new Error("failed to login")
    }
})
//api/user?seach=name
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
            
        ]
    } : {}
    
    const users = await User.find(keyword)
        .find({ _id: { $ne: req.user._id } })
    
    res.send(users)
}) 
    

export { login, register, allUsers }