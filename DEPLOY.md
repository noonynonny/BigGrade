# 🚀 Quick Deployment Guide

## Step 1: Deploy API Server to Railway (5 minutes)

### A. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

### B. Deploy Server
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `noonynonny/BigGrade`
4. Click "Add variables"
5. Add:
   - Key: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_Ciaod3u1vYsR@ep-snowy-cell-af1w7n5j-pooler.c-2.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require`
6. Under "Settings":
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
7. Click "Deploy"

### C. Get Your API URL
After deployment, Railway will give you a URL like:
```
https://biggrade-production.up.railway.app
```

---

## Step 2: Update React App (2 minutes)

### A. Update Environment Variables
Go to Netlify dashboard → Your site → Site configuration → Environment variables

Add or update:
```
VITE_NEON_API_URL=https://your-railway-url.railway.app/api
```

### B. Trigger Redeploy
Go to Deploys → Trigger deploy → Deploy site

---

## Step 3: Update Your Code (Optional)

If you want to fully switch from Base44 to Neon:

### Replace base44Client with neonClient
```javascript
// Find all files using base44Client
// Replace:
import { base44 } from '@/api/base44Client';

// With:
import { neon } from '@/api/neonClient';

// Then replace all base44.* calls with neon.*
```

---

## Alternative: Deploy to Render

### A. Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

### B. Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repo: `noonynonny/BigGrade`
3. Configure:
   - Name: `biggrade-api`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add Environment Variable:
   - Key: `DATABASE_URL`
   - Value: (Neon connection string)
5. Click "Create Web Service"

---

## Alternative: Deploy to Vercel

### A. Create vercel.json in server directory
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### B. Deploy
```bash
cd /home/ubuntu/BigGrade/server
npm install -g vercel
vercel
```

---

## Testing Your Deployment

### Test API Health
```bash
curl https://your-api-url.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "message": "BigGrade API is running"
}
```

### Test Database Connection
```bash
curl https://your-api-url.railway.app/api/megathreads
```

Should return array of threads.

---

## Troubleshooting

### Railway Deployment Fails
- Check build logs in Railway dashboard
- Ensure `package.json` exists in `/server` directory
- Verify `DATABASE_URL` is set correctly

### API Returns 500 Error
- Check Railway logs
- Verify Neon database is active (not suspended)
- Test connection string locally

### React App Can't Connect
- Verify `VITE_NEON_API_URL` is set in Netlify
- Check CORS settings in `server/index.js`
- Ensure API server is running

---

## Cost Estimate

### Free Tier (Perfect for Development)
- **Neon:** Free - 0.5GB storage, 100 hours/month compute
- **Railway:** Free - $5 credit/month (enough for small API)
- **Netlify:** Free - 100GB bandwidth, unlimited sites

### If You Outgrow Free Tier
- **Neon Pro:** $19/month - 10GB storage, unlimited compute
- **Railway:** $5/month per service
- **Netlify Pro:** $19/month - 1TB bandwidth

**Total for small production app:** ~$0-10/month

---

## Next Steps After Deployment

1. ✅ Add authentication (JWT or Auth0)
2. ✅ Add input validation
3. ✅ Set up monitoring (Railway has built-in)
4. ✅ Add rate limiting
5. ✅ Create staging environment (Neon branching)
6. ✅ Set up CI/CD (GitHub Actions)

---

## Quick Links

- **Neon Dashboard:** https://console.neon.tech/app/projects/polished-sky-87327576
- **Railway:** https://railway.app
- **Render:** https://render.com
- **Netlify:** https://app.netlify.com
- **Your Site:** https://fascinating-fairy-061c74.netlify.app

---

**That's it! Your app is production-ready!** 🎉

