import express from 'express';
import {
  createMeeting,
  getMeetings,
  updateMeeting,
  deleteMeeting,
} from '../controllers/meetingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.post('/create', createMeeting);
router.get('/', getMeetings);
router.put('/:id', updateMeeting);
router.delete('/:id', deleteMeeting);

export default router;
