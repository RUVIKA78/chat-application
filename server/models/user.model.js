import mongoose from "mongoose"
import bcrypt from "bcrypt"
const userSchema = mongoose.Schema({

    username: {
        type: String,
        required:true
    },
    email: {
        type: String, 
        required:true

    },
    password: {
        type: String,
        required:true
    },
    profileImage: {
        type: String,

    },
    isAdmin: {
        type: Boolean,
        required: true,
        default:false
    },
}, {timestamps:true})


userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = new mongoose.model("User", userSchema)

export default User