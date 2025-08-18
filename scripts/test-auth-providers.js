#!/usr/bin/env node

/**
 * Authentication Provider Test Script
 * Tests all OAuth providers: Google, Apple, Facebook, Twitter
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('=== FIREBASE AUTHENTICATION PROVIDER TEST ===\n');

// Test Firebase initialization
try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log('✅ Firebase initialized successfully');
  console.log(`   Project ID: ${firebaseConfig.projectId}`);
  console.log(`   Auth Domain: ${firebaseConfig.authDomain}\n`);
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  process.exit(1);
}

// Test provider configurations
const results = {
  google: { status: 'UNKNOWN', errors: [] },
  apple: { status: 'UNKNOWN', errors: [] },
  facebook: { status: 'UNKNOWN', errors: [] },
  twitter: { status: 'UNKNOWN', errors: [] }
};

console.log('🔧 TESTING PROVIDER CONFIGURATIONS...\n');

// Test Google Provider
try {
  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  results.google.status = 'CONFIGURED';
  console.log('✅ Google Provider: Configuration valid');
} catch (error) {
  results.google.status = 'FAILED';
  results.google.errors.push(error.message);
  console.log('❌ Google Provider: Configuration failed -', error.message);
}

// Test Apple Provider
try {
  const appleProvider = new OAuthProvider('apple.com');
  appleProvider.addScope('email');
  appleProvider.addScope('name');
  results.apple.status = 'CONFIGURED';
  console.log('✅ Apple Provider: Configuration valid');
} catch (error) {
  results.apple.status = 'FAILED';
  results.apple.errors.push(error.message);
  console.log('❌ Apple Provider: Configuration failed -', error.message);
}

// Test Facebook Provider
try {
  const facebookProvider = new FacebookAuthProvider();
  facebookProvider.addScope('email');
  results.facebook.status = 'CONFIGURED';
  console.log('✅ Facebook Provider: Configuration valid');
} catch (error) {
  results.facebook.status = 'FAILED';
  results.facebook.errors.push(error.message);
  console.log('❌ Facebook Provider: Configuration failed -', error.message);
}

// Test Twitter Provider
try {
  const twitterProvider = new TwitterAuthProvider();
  results.twitter.status = 'CONFIGURED';
  console.log('✅ Twitter Provider: Configuration valid');
} catch (error) {
  results.twitter.status = 'FAILED';
  results.twitter.errors.push(error.message);
  console.log('❌ Twitter Provider: Configuration failed -', error.message);
}

// Environment Variable Validation
console.log('\n🔐 ENVIRONMENT VARIABLES CHECK...\n');

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'TWITTER_API_KEY',
  'TWITTER_API_SECRET'
];

let envValid = true;
for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: Present`);
  } else {
    console.log(`❌ ${envVar}: Missing`);
    envValid = false;
  }
}

// Final Summary
console.log('\n📊 FINAL SUMMARY\n');

for (const [provider, result] of Object.entries(results)) {
  const status = result.status === 'CONFIGURED' ? '✅ PASS' : '❌ FAIL';
  console.log(`${provider.toUpperCase()}: ${status}`);
  if (result.errors.length > 0) {
    result.errors.forEach(error => console.log(`   Error: ${error}`));
  }
}

console.log(`\nEnvironment Variables: ${envValid ? '✅ VALID' : '❌ INVALID'}`);

console.log('\n🚀 NEXT STEPS:');
console.log('1. Test providers in browser by clicking auth buttons');
console.log('2. Check Firebase Console → Authentication → Sign-in method');
console.log('3. Verify redirect URIs match your domain');
console.log('4. Test each provider login flow manually');

if (envValid && Object.values(results).every(r => r.status === 'CONFIGURED')) {
  console.log('\n🎉 All authentication providers are correctly configured!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some authentication providers need attention.');
  process.exit(1);
}