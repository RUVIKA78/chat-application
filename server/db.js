import mongoose from "mongoose"

const connectionDb = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
        })
        console.log("mongodb connected");
    } catch (error) {
        console.log("mongodb error : ",error);
    }
}

export default connectionDb