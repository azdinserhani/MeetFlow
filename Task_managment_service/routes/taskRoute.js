import express, { Router } from "express";
import { createTask } from "../controller/taskController.js";
import { verifyTaskRole } from "../middleware/verifyToken.js";

const router = express.Router();
router.post("/",verifyTaskRole,createTask)
export default router;
