import admin from 'firebase-admin';
import { logger } from '../utils/logger.js';

const initFirebase = () => {
  if (admin.apps.length > 0) return admin.app();

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    logger.warn('Firebase credentials are missing. Firebase features will be disabled.');
    return null;
  }

  const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
};

const firebaseApp = initFirebase();

export const firebaseStorage = firebaseApp ? admin.storage().bucket() : null;
export const firebaseMessaging = firebaseApp ? admin.messaging() : null;
export default firebaseApp;
