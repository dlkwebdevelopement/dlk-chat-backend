import express from 'express';
import {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
} from '../controllers/groupController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.post('/create', createGroup);
router.get('/', getGroups);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.put('/:id/add-member', addGroupMember);
router.put('/:id/remove-member', removeGroupMember);

export default router;
