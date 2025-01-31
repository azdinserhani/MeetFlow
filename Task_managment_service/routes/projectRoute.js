import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createProject, getAllProjects } from '../controller/projectController.js';
const router = express.Router();
router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getAllProjects);
export default router;