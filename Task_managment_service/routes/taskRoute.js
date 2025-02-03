import express, { Router } from "express";
import {
  assignTask,
  createTask,
  deleteTask,
  getTasks,
  unassignTask,
  updateTask,
} from "../controller/taskController.js";
import {
  checkTeamMember,
  checkUserRole,
  verifyAssignTask,
  verifyTaskRole,
  verifyToken,
} from "../middleware/verifyToken.js";

const router = express.Router();
router.post("/", verifyToken, verifyTaskRole(["admin"]), createTask);
router.get(
  "/:project_id",
  verifyToken,
  verifyTaskRole(["admin", "participant", "organizer"]),
  getTasks
);
router.delete(
  "/:id/:project_id",
  verifyToken,
  verifyTaskRole(["organizer", "admin"]),
  deleteTask
);
router.patch(
  "/:id/:project_id",
  verifyToken,
  verifyTaskRole(["organizer", "admin"]),
  updateTask
);
router.post("/:id/:team_id/assign", verifyToken, verifyAssignTask, assignTask);
router.delete(
  "/:id/:team_id/unassign",
  verifyToken,
  checkUserRole,
  checkTeamMember,
  unassignTask
);
export default router;
