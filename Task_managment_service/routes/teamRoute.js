import express from "express";
import { createTeam, updateTeam } from "../controller/teamController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTeam);
router.put("/:id", verifyToken, updateTeam);
export default router;
