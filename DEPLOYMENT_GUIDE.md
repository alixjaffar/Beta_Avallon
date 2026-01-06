# Avallon Platform Deployment Guide

## Current Status ✅

### Backend (Deployed)
- **URL**: https://beta-avallon.onrender.com
- **Status**: ✅ Successfully deployed on Vercel
- **Features**: All API endpoints working, admin dashboard accessible

### Frontend (Local Development)
- **URL**: http://localhost:8083 (when running locally)
- **Status**: ✅ Connected to deployed backend
- **Features**: Full signup flow, website creation, admin dashboard

## How to Run Locally

### Option 1: Full Stack (Recommended)
```bash
npm run dev
```
This runs both frontend (port 8083) and backend (port 3000) simultaneously.

### Option 2: Frontend Only (Connected to Deployed Backend)
```bash
cd frontend
npm run dev
```
This runs only the frontend, connected to your deployed backend.

## Features Available

### For Users (Frontend)
- ✅ **Sign up** for beta access
- ✅ **Create websites** with AI
- ✅ **View dashboard** with created sites
- ✅ **Edit websites** with AI chat

### For Admins (Backend)
- ✅ **Admin dashboard** at https://beta-avallon.onrender.com/admin/emails
- ✅ **View beta signups**
- ✅ **Send bulk emails**
- ✅ **Monitor email logs**

## Next Steps

1. **Deploy Frontend**: Consider deploying the frontend to Vercel as well
2. **Custom Domain**: Set up a custom domain for production
3. **Environment Variables**: Configure production environment variables
4. **Database**: Ensure production database is properly configured

## API Endpoints

All endpoints are available at: `https://beta-avallon.onrender.com/api/`

- `/beta-signups` - Manage beta signups
- `/sites` - Website management
- `/sites/generate` - AI website generation
- `/bulk-email` - Send bulk emails
- `/admin/emails` - Email logs dashboard
