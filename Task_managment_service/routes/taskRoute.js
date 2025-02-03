import express, { Router } from "express";
import {
  assignTask,
  createTask,
  deleteTask,
  getAssignedTasks,
  getAssignedTasksByUserId,
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
router.get("/", verifyToken, getAssignedTasks);
router.get("/assigned/:user_id", verifyToken, getAssignedTasksByUserId);

//TODO:
// GET /unassigned → Fetch tasks that are not assigned to any team or user.
//GET /analytics/team/:team_id/tasks → Get the number of tasks assigned and completed by a team.
// GET /analytics/project/:project_id/tasks → Get total tasks in a project with status breakdown
export default router;
