import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_NAME || 'teamconnect',
    });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

export default connectDB;
