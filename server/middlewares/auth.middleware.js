import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
            
            req.user=await User.findById(decode.id).select("-password")
       next()
        } catch (error) {
            res.status(401)
            throw new Error("Not authorized")
        }
    }
    if (!token) {
        res.status(401)
        throw new Error("token not found!!")
    }
})

export {protect}