import express, { Router } from 'express'
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
  updateTeam
} from '../controller/teamController.js'
import { verifyRole, verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, verifyRole('organizer'), createTeam)
router.put('/:id', verifyToken, verifyRole('admin'), updateTeam)
router.delete('/:id', verifyToken, verifyRole('admin'), deleteTeam)
router.get('/:id', verifyToken, getTeam)
router.get('/', verifyToken, getTeams)
router.get('/:id/members', verifyToken,verifyRole("admin"), getTeamMembers)
router.post('/:id/user', verifyToken, verifyRole('admin'), addMemberToTeam)
router.delete(
  '/:id/user',
  verifyToken,
  verifyRole('admin'),
  removeMemberFromTeam
)
router.get('/:id/projects', verifyToken, getProjectsForTeam)
router.put("/:id/user", verifyToken, verifyRole("admin"), changeUserRole);
export default router
