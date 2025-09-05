# Firebase Authentication Configuration Guide

## Overview
This project uses Firebase Authentication with support for multiple OAuth providers: Google, Apple, Facebook (Meta), and X (Twitter).

## Firebase Console Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g., "veganmapai")
3. Enable Google Analytics (optional)

### 2. Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable the following providers:

#### Google Provider
- Click **Google** → **Enable**
- Configure OAuth consent screen
- Add authorized domains:
  - `localhost:5173` (development)
  - `your-repl-name.replit.app` (Replit)
  - `veganmapai.ai` (production)

#### Apple Provider
- Click **Apple** → **Enable**
- Configure in Apple Developer Console:
  - Services ID (Bundle ID)
  - Team ID
  - Key ID
  - Private Key (.p8 file)
- Add authorized domains in Apple Developer Console

#### Facebook Provider
- Click **Facebook** → **Enable**
- Configure in [Meta for Developers](https://developers.facebook.com):
  - Create Facebook App
  - Add Facebook Login product
  - Set OAuth redirect URIs:
    - `https://your-project-id.firebaseapp.com/__/auth/handler`
  - Copy App ID and App Secret to Firebase Console

#### Twitter (X) Provider
- Click **Twitter** → **Enable**
- Configure in [Twitter Developer Portal](https://developer.twitter.com):
  - Create Twitter App
  - Enable OAuth 2.0
  - Set callback URLs:
    - `https://your-project-id.firebaseapp.com/__/auth/handler`
  - Copy API Key and API Secret to Firebase Console

### 3. Configure Authorized Domains
Add these domains in **Authentication** → **Settings** → **Authorized domains**:
- `localhost` (for development)
- `your-repl-name.replit.app` (for Replit)
- `veganmapai.ai` (for production)

### 4. Get Firebase Configuration
1. Go to **Project Settings** → **General**
2. In "Your apps" section, click **Web app** (</>)
3. Register app with nickname (e.g., "VeganMapAI Web")
4. Copy the config object

## Environment Variables

Set these in Replit Secrets or `.env.local`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id

# Google Maps API (required for maps)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Google Analytics 4 (optional)
VITE_GA4_ID=your-ga4-measurement-id
```

## Provider-Specific Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project
3. Enable Google+ API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials
6. Add authorized JavaScript origins and redirect URIs

### Apple Sign In
1. Apple Developer Account required ($99/year)
2. Create Services ID in Apple Developer Console
3. Configure Sign in with Apple
4. Generate private key (.p8 file)
5. Upload to Firebase Console

### Facebook Login
1. Create app in Meta for Developers
2. Add Facebook Login product
3. Configure Valid OAuth Redirect URIs
4. Submit for app review (for production)

### Twitter OAuth
1. Create app in Twitter Developer Portal
2. Enable OAuth 2.0 with PKCE
3. Set callback URLs
4. Configure app permissions

## Testing

After configuration:

1. Start development server: `npm run dev`
2. Go to `/auth` route
3. Test each provider:
   - Google: Should open Google OAuth popup
   - Apple: Should open Apple ID popup
   - Facebook: Should open Facebook login popup
   - Twitter: Should open X (Twitter) login popup

## Production Deployment

1. Update authorized domains in all provider consoles
2. Update redirect URIs to production domain
3. Ensure all environment variables are set in production
4. Test authentication flow on production domain

## Security Notes

- Firebase config values are safe to expose in frontend
- OAuth secrets are managed by Firebase/provider consoles
- Use HTTPS in production for security
- Enable App Check for additional security (optional)

## Troubleshooting

### Common Issues

1. **Popup blocked**: Enable popups for your domain
2. **Unauthorized domain**: Add domain to Firebase authorized domains
3. **Invalid redirect URI**: Check OAuth provider console settings
4. **App not approved**: Submit for review in provider console (Facebook/Twitter)

### Error Codes

- `auth/popup-blocked`: User needs to allow popups
- `auth/popup-closed-by-user`: User cancelled sign-in
- `auth/account-exists-with-different-credential`: Email already used with different provider
- `auth/network-request-failed`: Check internet connection

## Next Steps

1. Configure Firebase project and get API keys
2. Set up OAuth providers in respective consoles
3. Add environment variables to Replit Secrets
4. Test authentication with Google first (easiest to set up)
5. Add other providers one by one
6. Test account linking between providers