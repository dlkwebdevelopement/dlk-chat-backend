import express from 'express';
import {
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  createDefaultSuperAdmin,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

createDefaultSuperAdmin().catch(console.error);

export default router;
