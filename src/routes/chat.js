import express from 'express';
import { sendMessage, getConversationMessages, getConversations } from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/conversations', getConversations);
router.post('/send', sendMessage);
router.get('/messages/:id', getConversationMessages);

export default router;
