#!/usr/bin/env node

/**
 * Test script to verify all secrets are properly integrated
 */

console.log('🔍 Testing Secrets Integration for VeganMapAI\n');

// Test Firebase secrets
const firebaseSecrets = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN', 
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID'
];

console.log('✅ Firebase Configuration:');
firebaseSecrets.forEach(key => {
  const value = process.env[key];
  const status = value ? '✅' : '❌';
  const preview = value ? `${value.substring(0, 20)}...` : 'NOT SET';
  console.log(`  ${status} ${key}: ${preview}`);
});

// Test VITE_ prefixed Firebase secrets
const viteFirebaseSecrets = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID', 
  'VITE_FIREBASE_APP_ID'
];

console.log('\n✅ Frontend Firebase Configuration (VITE_):');
viteFirebaseSecrets.forEach(key => {
  const value = process.env[key];
  const status = value ? '✅' : '❌';
  const preview = value ? `${value.substring(0, 20)}...` : 'NOT SET';
  console.log(`  ${status} ${key}: ${preview}`);
});

// Test BGGPT secrets
const bggptSecrets = ['BGGPT_URL', 'BGGPT_WEB_URL'];

console.log('\n✅ BGGPT Integration:');
bggptSecrets.forEach(key => {
  const value = process.env[key];
  const status = value ? '✅' : '❌';
  const preview = value || 'NOT SET';
  console.log(`  ${status} ${key}: ${preview}`);
});

// Test other required secrets
const otherSecrets = [
  'DATABASE_URL',
  'OPENAI_API_KEY',
  'VITE_GOOGLE_MAPS_API_KEY',
  'VITE_GA4_ID'
];

console.log('\n✅ Other Required Secrets:');
otherSecrets.forEach(key => {
  const value = process.env[key];
  const status = value ? '✅' : '❌';
  const preview = value ? `${value.substring(0, 20)}...` : 'NOT SET';
  console.log(`  ${status} ${key}: ${preview}`);
});

// Validation summary
const allSecrets = [...firebaseSecrets, ...viteFirebaseSecrets, ...bggptSecrets, ...otherSecrets];
const missingSecrets = allSecrets.filter(key => !process.env[key]);

console.log('\n📊 Summary:');
console.log(`Total secrets checked: ${allSecrets.length}`);
console.log(`Configured: ${allSecrets.length - missingSecrets.length}`);
console.log(`Missing: ${missingSecrets.length}`);

if (missingSecrets.length > 0) {
  console.log('\n❌ Missing secrets:');
  missingSecrets.forEach(key => console.log(`  - ${key}`));
  process.exit(1);
} else {
  console.log('\n🎉 All secrets properly configured!');
  process.exit(0);
}