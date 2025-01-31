import express, { Router } from "express";
import {
  addMemberToTeam,
  changeUserRole,
  createTeam,
  deleteTeam,
  getProjectsForTeam,
  getTeam,
  getTeamMembers,
  getTeams,
  removeMemberFromTeam,
  updateTeam,
} from "../controller/teamController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTeam);
router.put("/:id", verifyToken, updateTeam);
router.delete("/:id", verifyToken, deleteTeam);
router.get("/:id", verifyToken, getTeam);
router.get("/", verifyToken, getTeams);
router.get("/:id/members", verifyToken, getTeamMembers);
router.post("/:id/user", verifyToken, addMemberToTeam);
router.delete("/:id/user", verifyToken, removeMemberFromTeam);
router.get("/:id/projects", verifyToken, getProjectsForTeam);
router.put("/:id/user", verifyToken, changeUserRole);
export default router;
