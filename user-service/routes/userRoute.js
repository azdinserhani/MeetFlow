import express from "express";
import { deleteUser, getUserById, updateUser } from "../controller/userController.js";
import { verifyAuth, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyAuth, getUserById);
router.put("/", verifyToken, updateUser);
router.delete("/", verifyToken, deleteUser);

export default router;
