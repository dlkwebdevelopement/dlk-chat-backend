import nodemailer from 'nodemailer';
import { logger } from './logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async ({ email, code }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('SMTP credentials missing, OTP email skipped');
    return null;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Your TeamConnect OTP code',
    html: `<p>Your TeamConnect verification code is <strong>${code}</strong>.</p><p>This code is valid for 15 minutes.</p>`,
  });
};
