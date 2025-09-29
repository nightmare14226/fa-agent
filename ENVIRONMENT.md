# Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fa_agent"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# HubSpot OAuth
HUBSPOT_CLIENT_ID="your-hubspot-client-id"
HUBSPOT_CLIENT_SECRET="your-hubspot-client-secret"
HUBSPOT_REDIRECT_URI="http://localhost:3000/api/auth/hubspot/callback"
```

## Getting OAuth Credentials

### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)

### HubSpot OAuth Setup:
1. Go to [HubSpot Developer Portal](https://developers.hubspot.com/)
2. Create a new app
3. Go to "Auth" tab
4. Set redirect URI:
   - `http://localhost:3000/api/auth/hubspot/callback` (development)
   - `https://your-domain.com/api/auth/hubspot/callback` (production)
5. Copy Client ID and Client Secret

## For Render Deployment:
Add these environment variables in your Render dashboard under your web service's "Environment" tab.
