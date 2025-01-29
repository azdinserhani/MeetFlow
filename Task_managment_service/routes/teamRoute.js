import express from "express";
import { createTeam, deleteTeam, updateTeam } from "../controller/teamController.js";
import {  verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTeam);
router.put("/:id", verifyToken, updateTeam);
router.delete("/:id",verifyToken,deleteTeam)
export default router;


