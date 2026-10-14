import http from 'http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import customerRoutes from './routes/customers.js';
import userRoutes from './routes/users.js';
import chatRoutes from './routes/chat.js';
import groupRoutes from './routes/groups.js';
import meetingRoutes from './routes/meetings.js';
import notificationRoutes from './routes/notifications.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { socketServer } from './services/socketServer.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiRateLimiter);

connectDB(process.env.MONGODB_URI);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'TeamConnect backend is running' });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'TeamConnect backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

socketServer(io);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  logger.info(`TeamConnect backend listening on port ${port}`);
});
