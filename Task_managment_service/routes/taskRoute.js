import express, { Router } from "express";
import {
  assignTask,
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controller/taskController.js";
import {
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
export default router;
