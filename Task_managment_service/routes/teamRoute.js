import express from "express";
import { createTeam, deleteTeam, getTeam, getTeamMembers, getTeams, updateTeam } from "../controller/teamController.js";
import {  verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTeam);
router.put("/:id", verifyToken, updateTeam);
router.delete("/:id",verifyToken,deleteTeam)
router.get("/:id", verifyToken, getTeam);
router.get("/", verifyToken, getTeams);
router.get("/:id/members", verifyToken, getTeamMembers);
export default router;


