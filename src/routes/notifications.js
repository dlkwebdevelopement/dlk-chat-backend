import express from 'express';
import { getNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', getNotifications);
router.put('/:id/read', markNotificationAsRead);

export default router;
