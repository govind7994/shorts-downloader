# 📋 Quick Reference Card

## 🚀 Common Commands

### Start/Stop Server
```bash
# Start server
npm start

# Start with auto-reload (development)
npm run dev

# Stop server
Ctrl+C
```

### Access Application
- **Local**: http://localhost:3000
- **Network**: http://YOUR_IP:3000

## 🎯 Quick Tasks

### Change Port
1. Open `.env`
2. Change `PORT=3000` to desired port
3. Restart server

### Adjust Rate Limits
1. Open `.env`
2. Change `RATE_LIMIT_MAX_REQUESTS=10`
3. Restart server

### View Logs
- Check terminal where server is running
- Look for error messages in red

### Test API
```bash
# Health check
curl http://localhost:3000/api/health

# Get video info
curl -X POST http://localhost:3000/api/download/info \
  -H "Content-Type: application/json" \
  -d '{"url":"YOUR_VIDEO_URL"}'
```

## 🎨 Customization

### Change Colors
Edit `frontend/index.html`:
- `from-blue-500` → Gradient start
- `to-purple-600` → Gradient end
- `bg-slate-900` → Background

### Change Text
Edit `frontend/index.html`:
- Hero heading: Line ~80
- Platform buttons: Line ~95
- Features: Line ~200+

### Change Logo
Edit `frontend/index.html`:
- Line ~70: Change 📥 emoji

## 🐛 Troubleshooting

### Can't access site?
1. Check server is running
2. Try http://127.0.0.1:3000
3. Check firewall

### Download fails?
1. Check video URL is correct
2. Verify video is public
3. Check internet connection

### Port in use?
1. Change PORT in `.env`
2. Or stop other app on port 3000

## 📁 File Locations

### Configuration
- `.env` - Environment variables
- `package.json` - Dependencies

### Frontend
- `frontend/index.html` - Main page
- `frontend/app.js` - JavaScript

### Backend
- `backend/server.js` - Main server
- `backend/routes/download.js` - API routes
- `backend/services/downloader.js` - Download logic

### Documentation
- `README.md` - Full docs
- `SETUP_GUIDE.md` - Quick start
- `DEPLOYMENT.md` - Production guide
- `PROJECT_SUMMARY.md` - Overview

## 🔧 Environment Variables

```env
PORT=3000                        # Server port
NODE_ENV=development             # Environment
RATE_LIMIT_WINDOW_MS=900000      # 15 min in ms
RATE_LIMIT_MAX_REQUESTS=10       # Max requests
ALLOWED_ORIGINS=http://localhost:3000
```

## 🎯 Test URLs

YouTube Shorts examples:
- `https://youtube.com/shorts/abc123`
- `https://www.youtube.com/shorts/xyz789`
- `https://youtu.be/def456`

## 📊 Server Info

Current setup:
- **Port**: 3000
- **Environment**: Development
- **Rate Limit**: 10 req/15min
- **Platform**: YouTube Shorts
- **Storage**: None (streaming only)

## 🚨 Emergency

### Server crashed?
```bash
npm start
```

### Need to restart?
```bash
Ctrl+C
npm start
```

### Check if running?
```bash
curl http://localhost:3000/api/health
```

## 📞 Help

1. Check `README.md`
2. Check `SETUP_GUIDE.md`
3. Check terminal logs
4. Check browser console (F12)

---

**Keep this file handy for quick reference!**
