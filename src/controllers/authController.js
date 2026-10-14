import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { generateCustomerId, generateEmployeeId } from '../utils/idGenerator.js';
import { sendOtpEmail } from '../utils/emailSender.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const login = async (req, res) => {
  const { loginId, password } = req.body;
  if (!loginId || !password) {
    res.status(400);
    throw new Error('Login ID and password are required');
  }

  const query = loginId.includes('@EMP') ? { employeeId: loginId } : loginId.includes('@CUS') ? { customerId: loginId } : { email: loginId };
  const user = await User.findOne(query);

  if (!user || !user.isActive || user.isBlocked || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = signToken(user._id);
  res.status(200).json({
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      customerId: user.customerId,
      isOnline: user.isOnline,
      currentStatus: user.currentStatus,
    },
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await OTP.create({ email, code, expiresAt });
  await sendOtpEmail({ email, code });

  res.status(200).json({ message: 'OTP sent to email' });
};

export const verifyOtp = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    res.status(400);
    throw new Error('Email and OTP code are required');
  }

  const otpRecord = await OTP.findOne({ email, code, used: false });
  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  otpRecord.used = true;
  await otpRecord.save();
  res.status(200).json({ verified: true });
};

export const resetPassword = async (req, res) => {
  const { email, code, password } = req.body;
  if (!email || !code || !password) {
    res.status(400);
    throw new Error('Email, OTP code and new password are required');
  }

  const otpRecord = await OTP.findOne({ email, code, used: false });
  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  otpRecord.used = true;
  await otpRecord.save();

  res.status(200).json({ message: 'Password reset successful' });
};

export const createDefaultSuperAdmin = async () => {
  const existing = await User.findOne({ role: 'super_admin' });
  if (existing) return;

  const password = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'Admin@123', 10);
  await User.create({
    fullName: 'TeamConnect Super Admin',
    email: process.env.SUPER_ADMIN_EMAIL || 'admin@teamconnect.com',
    password,
    role: 'super_admin',
    employeeId: await generateEmployeeId(1),
  });
};
