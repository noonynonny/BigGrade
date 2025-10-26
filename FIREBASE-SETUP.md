# 🔐 Firebase Google Authentication Setup

## Step 1: Create Firebase Project (5 minutes)

### A. Go to Firebase Console
1. Visit https://console.firebase.google.com/
2. Click "Add project"
3. Project name: **BigGrade**
4. Disable Google Analytics (optional)
5. Click "Create project"

### B. Enable Google Authentication
1. In your Firebase project, go to **Build** → **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Click on **Google**
5. Toggle "Enable"
6. Set support email: (your email)
7. Click "Save"

### C. Register Web App
1. In Project Overview, click the **</>** (Web) icon
2. App nickname: **BigGrade Web**
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the `firebaseConfig` object

---

## Step 2: Add Firebase Config to Your App

### A. Update .env File
Add these variables to `/home/ubuntu/BigGrade/.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Example from Firebase Console:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",  // ← Copy this
  authDomain: "biggrade-12345.firebaseapp.com",  // ← Copy this
  projectId: "biggrade-12345",  // ← Copy this
  storageBucket: "biggrade-12345.appspot.com",  // ← Copy this
  messagingSenderId: "123456789",  // ← Copy this
  appId: "1:123456789:web:abc123"  // ← Copy this
};
```

### B. Add to Netlify Environment Variables
1. Go to Netlify Dashboard → Your site
2. Site configuration → Environment variables
3. Add all 6 Firebase variables (same as above)
4. Save

---

## Step 3: Configure Authorized Domains

### A. Add Your Netlify Domain
1. In Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add: `fascinating-fairy-061c74.netlify.app`
5. Add: `localhost` (for local development)
6. Save

---

## Step 4: Test Authentication

### Local Testing
```bash
cd /home/ubuntu/BigGrade
npm run dev
```

Visit `http://localhost:5173/login` and try signing in with Google.

### Production Testing
After deploying to Netlify, visit:
```
https://fascinating-fairy-061c74.netlify.app/login
```

---

## What I've Already Done ✅

1. ✅ Installed Firebase SDK
2. ✅ Created Firebase configuration (`src/config/firebase.js`)
3. ✅ Created Authentication Context (`src/context/AuthContext.jsx`)
4. ✅ Created Login Page (`src/pages/Login.jsx`)
5. ✅ Created Protected Route component
6. ✅ Updated App.jsx with authentication flow
7. ✅ Styled login page to match Base44 design

---

## How It Works

### Login Flow
1. User visits your site
2. Redirected to `/login` if not authenticated
3. Clicks "Continue with Google"
4. Google sign-in popup appears
5. User selects Google account
6. Redirected to home page
7. User info stored in context

### Protected Routes
All pages except `/login` require authentication:
- If not logged in → Redirect to `/login`
- If logged in → Access granted

### User Data Available
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { currentUser, logout } = useAuth();
  
  console.log(currentUser.email);
  console.log(currentUser.displayName);
  console.log(currentUser.photoURL);
  
  return (
    <button onClick={logout}>Sign Out</button>
  );
}
```

---

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
**Solution:** Add your domain to Authorized domains in Firebase Console

### "Firebase: Error (auth/configuration-not-found)"
**Solution:** Check that all environment variables are set correctly

### Login popup blocked
**Solution:** Allow popups for your domain in browser settings

### "Module not found: firebase"
**Solution:** Run `npm install firebase` in your project

---

## Security Best Practices

### Current Setup (Development)
- ✅ Firebase handles authentication
- ✅ Google OAuth secure
- ✅ Environment variables for config

### For Production
Consider adding:
1. **Email verification** - Require verified emails
2. **User roles** - Store in Neon database
3. **Session management** - Add refresh tokens
4. **Rate limiting** - Prevent abuse
5. **Security rules** - Firebase security rules

---

## Next Steps

After setting up Firebase:

1. **Test locally** - Make sure Google sign-in works
2. **Deploy to Netlify** - Add env vars and deploy
3. **Sync with Neon** - Store user data in your database
4. **Add user roles** - Determine student vs tutor
5. **Customize profile** - Let users complete their profile

---

## Integration with Neon Database

After user signs in, save their info to Neon:

```javascript
// In your login flow
const userData = await login();

// Save to Neon database
await fetch('https://your-api.railway.app/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: userData.email,
    full_name: userData.displayName,
    avatar_url: userData.photoURL,
    user_type: 'student' // or 'tutor'
  })
});
```

---

## Cost

**Firebase Authentication:**
- **Free tier:** 50,000 monthly active users
- **No credit card required**
- **Unlimited Google sign-ins**

**Perfect for your needs!** 🎉

---

## Quick Reference

### Firebase Console
https://console.firebase.google.com/

### Your Project
https://console.firebase.google.com/project/YOUR_PROJECT_ID

### Documentation
https://firebase.google.com/docs/auth/web/google-signin

---

## Summary

**What you need to do:**
1. Create Firebase project (5 min)
2. Enable Google auth
3. Copy config values
4. Add to .env and Netlify
5. Test!

**Then your app will have:**
- ✅ Google Sign-In button
- ✅ Protected routes
- ✅ User authentication
- ✅ Same experience as Base44 version

Let me know once you've created the Firebase project and I'll help you configure it!

