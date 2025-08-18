import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  type User
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');

const twitterProvider = new TwitterAuthProvider();

const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// Auth functions
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithApple = () => signInWithPopup(auth, appleProvider);
export const loginWithFacebook = () => signInWithPopup(auth, facebookProvider);
export const loginWithTwitter = () => signInWithPopup(auth, twitterProvider);

export const logout = () => signOut(auth);
export const onUser = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb);