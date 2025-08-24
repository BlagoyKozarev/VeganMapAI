import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App | undefined;

// Initialize Firebase Admin SDK
export function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    try {
      // For production, use service account key
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID
        });
      } else {
        // For development, use default credentials (if available)
        adminApp = initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID
        });
      }
      console.log('✅ Firebase Admin SDK initialized');
    } catch (error) {
      console.log('⚠️ Firebase Admin SDK not configured, continuing without admin features');
      console.log('To enable: Add FIREBASE_SERVICE_ACCOUNT_KEY to secrets');
    }
  }
  return adminApp;
}

// Get Firebase Auth admin instance
export function getFirebaseAuth() {
  if (!adminApp) {
    adminApp = initializeFirebaseAdmin();
  }
  if (!adminApp) {
    throw new Error('Firebase Admin not initialized');
  }
  return getAuth(adminApp);
}

// Verify Firebase ID token from frontend
export async function verifyIdToken(idToken: string) {
  try {
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Firebase ID token verification failed:', error);
    throw new Error('Invalid Firebase token');
  }
}