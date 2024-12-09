import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { accessChat, addToGroup, createGroupChat, fetchChat, renameGroup, removeFromGroup } from "../controllers/chat.controller.js"

const router = express.Router()

router.route("/").post(protect, accessChat)
router.route('/').get(protect, fetchChat)
router.route('/group').post(protect, createGroupChat)
router.route('/rename').put(protect, renameGroup)
router.route('/groupadd').put(protect, addToGroup)
router.route("/groupremove").put(protect, removeFromGroup)

export default router