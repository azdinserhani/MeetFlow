import express from "express";
import {
  deleteUser,
  getAllUser,
  getUserById,
  updateUser,
} from "../controller/userController.mjs";
import { verifyAuth, verifyToken } from "../middleware/verifyToken.mjs";

const router = express.Router();

router.get("/:id", verifyAuth, getUserById);
router.put("/", verifyToken, updateUser);
router.delete("/", verifyToken, deleteUser);
router.get("/", verifyToken, getAllUser);

export default router;
