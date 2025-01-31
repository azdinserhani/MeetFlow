import express from 'express';
import { verifyRole, verifyToken } from '../middleware/verifyToken.js';
import { createProject, getAllProjects, getProjectById, updateProject } from '../controller/projectController.js';
const router = express.Router();
router.post("/", verifyToken, verifyRole("organizer"), createProject);
router.get('/', verifyToken, getAllProjects);
router.get('/:id', verifyToken, getProjectById);
router.put('/:id', verifyToken, updateProject);
export default router;