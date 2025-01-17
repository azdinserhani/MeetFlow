import express from "express";
import { createTeam } from "../controller/teamController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTeam);
export default router;
