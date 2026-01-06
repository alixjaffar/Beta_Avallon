# 🚀 How to Run Avallon

## Quick Start (Easiest Way)

### Option 1: Run Both Servers Together (Recommended)

From the project root directory:

```bash
cd /Users/alijaffar/Documents/GitHub/Beta_Avallon
npm run dev
```

This will start:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

**Open your browser**: http://localhost:5173

---

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd /Users/alijaffar/Documents/GitHub/Beta_Avallon/backend
npm run dev
```
Backend runs on: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd /Users/alijaffar/Documents/GitHub/Beta_Avallon/frontend
npm run dev
```
Frontend runs on: http://localhost:5173

---

## 🔍 Check if Already Running

### Check what's running:
```bash
# Check ports
lsof -i :3000  # Backend
lsof -i :5173  # Frontend

# Or check processes
ps aux | grep -E "(next|vite)" | grep -v grep
```

### Stop existing servers:
```bash
# Find and kill processes on ports
lsof -ti:3000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend

# Or press Ctrl+C in the terminal running the servers
```

---

## ✅ Before Running - Quick Checklist

1. **Environment Variables Set**:
   ```bash
   cd backend
   # Check .env file exists and has:
   # - DATABASE_URL
   # - GEMINI_API_KEY (just added!)
   # - EMAIL_USER, EMAIL_APP_PASSWORD
   # - N8N_BASE_URL, N8N_API_KEY
   ```

2. **Dependencies Installed**:
   ```bash
   npm run install:all
   # Or separately:
   # cd backend && npm install
   # cd frontend && npm install
   ```

3. **Database Migrated** (if first time):
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   ```

---

## 🎯 Step-by-Step: First Time Setup

### 1. Install Dependencies
```bash
cd /Users/alijaffar/Documents/GitHub/Beta_Avallon
npm run install:all
```

### 2. Configure Environment
```bash
cd backend
# Make sure .env file exists with all required variables
# See MVP_READINESS_CHECKLIST.md for details
```

### 3. Setup Database (if needed)
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### 4. Start Development Servers
```bash
# From project root
npm run dev
```

### 5. Open Browser
```
http://localhost:5173
```

---

## 🧪 Verify It's Working

### 1. Check Backend Status
```bash
curl http://localhost:3000/api/test/current-status
```

Should show:
- Gemini API: ✅ Working (after restart)
- Database: ✅ Connected
- Vercel: ✅ Working

### 2. Test in Browser
- Go to: http://localhost:5173
- Sign up or log in
- Try creating a website
- Check dashboard

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Then restart
npm run dev
```

### Backend Won't Start
```bash
cd backend
# Check .env file exists
ls -la .env

# Check for errors
npm run dev
```

### Frontend Won't Start
```bash
cd frontend
# Reinstall dependencies
rm -rf node_modules
npm install
npm run dev
```

### Database Connection Error
```bash
cd backend
# Verify DATABASE_URL in .env
# Run migrations
npx prisma migrate dev
```

### Gemini API Not Working
```bash
# Make sure GEMINI_API_KEY is in backend/.env
# Restart backend after adding
cd backend
npm run dev
```

---

## 📝 Development Scripts

### From Project Root:
- `npm run dev` - Start both backend and frontend
- `npm run dev:backend` - Start only backend
- `npm run dev:frontend` - Start only frontend
- `npm run build` - Build for production
- `npm run install:all` - Install all dependencies

### Backend Only:
```bash
cd backend
npm run dev        # Start dev server
npm run build      # Build for production
npm run start      # Start production server
npm test           # Run tests
```

### Frontend Only:
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🚀 Production Deployment

### Backend (Vercel/Serverless):
```bash
cd backend
npm run build
# Deploy to Vercel
```

### Frontend (Vercel):
```bash
cd frontend
npm run build
# Deploy to Vercel
```

---

## 📍 Important URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Status**: http://localhost:3000/api/test/current-status
- **API Docs**: Check `README.md` for endpoint list

---

## 💡 Pro Tips

1. **Use the dev script**: `npm run dev` is easiest
2. **Check status endpoint**: Always verify backend is working
3. **Watch terminal logs**: Errors show up there
4. **Restart after .env changes**: Backend needs restart for new env vars
5. **Keep both terminals open**: If running separately, easier to see logs

---

## 🎯 Quick Reference

```bash
# Start everything
npm run dev

# Stop everything
Ctrl+C (in terminal)

# Check status
curl http://localhost:3000/api/test/current-status

# Open browser
open http://localhost:5173  # macOS
# or just navigate to http://localhost:5173
```








