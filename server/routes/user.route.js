import express from "express"
import { allUsers, login, register } from "../controllers/user.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = express.Router()

 

router.route('/login').post(login)
router.route('/').post(register).get(protect,allUsers)


export default router