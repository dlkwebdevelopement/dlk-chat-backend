import express from 'express';
import { getDirectory } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// This route is protected by standard authentication so any logged-in user can access it.
router.use(authenticate);

// GET /api/users/directory
router.get('/directory', getDirectory);

export default router;
