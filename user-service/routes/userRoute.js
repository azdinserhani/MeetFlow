import express from 'express';
import { getUserById } from '../controller/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/:id',verifyToken,getUserById)

export default router;