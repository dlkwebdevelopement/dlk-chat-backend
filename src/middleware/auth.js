import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies?.token;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    res.status(401);
    throw new Error('Authentication token required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Invalid or expired token');
  }
};
