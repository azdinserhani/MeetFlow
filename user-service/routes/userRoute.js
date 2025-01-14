import express from "express";
import { getUserById, updateUser } from "../controller/userController.js";
import { verifyAuth, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyAuth, getUserById);
router.put("/", verifyToken, updateUser);

export default router;
