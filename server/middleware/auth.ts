import { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../config/firebase-admin';

// Firebase user type for request
export interface FirebaseUser {
  uid: string;
  email?: string;
  email_verified?: boolean;
  firebase: any;
}

// Extend Express Request type to include Firebase user
declare global {
  namespace Express {
    interface Request {
      firebaseUser?: FirebaseUser;
    }
  }
}

// Firebase Authentication Middleware
export async function requireFirebaseAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid Authorization header',
        required: 'Bearer <firebase-id-token>'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return res.status(401).json({ 
        error: 'Missing Firebase ID token' 
      });
    }

    // Verify token with Firebase Admin SDK
    const decodedToken = await verifyIdToken(idToken);
    
    // Add Firebase user info to request
    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      email_verified: decodedToken.email_verified,
      firebase: decodedToken
    };

    next();
  } catch (error: any) {
    console.error('Firebase auth verification failed:', error.message);
    
    return res.status(401).json({ 
      error: 'Invalid Firebase token',
      details: error.message 
    });
  }
}

// Optional Firebase auth - adds user info if token is present, but doesn't require it
export async function optionalFirebaseAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      
      if (idToken) {
        const decodedToken = await verifyIdToken(idToken);
        req.firebaseUser = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          email_verified: decodedToken.email_verified,
          firebase: decodedToken
        };
      }
    }
    
    next();
  } catch (error) {
    // Don't fail on optional auth - just continue without user info
    console.log('Optional Firebase auth failed, continuing without user info');
    next();
  }
}