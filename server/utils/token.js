import jwt from "jsonwebtoken"

const generatedToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn:"1d"
    })
}

export default generatedToken