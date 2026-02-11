# CORS Fix for Cross-Region Access

## Problem
When accessing your Render deployment (Oregon, US West) from India, CORS errors were occurring during video downloads.

## Solution Applied

### 1. Enhanced CORS Configuration (`server.js`)
- **Explicit preflight handling**: Added `app.options('*', cors())` to handle OPTIONS requests
- **Comprehensive headers**: 
  - Allowed headers: `Content-Type`, `Authorization`, `Range`, `Accept`, `Accept-Encoding`
  - Exposed headers: `Content-Length`, `Content-Type`, `Content-Disposition`, `Content-Range`
- **Wildcard origin**: Set `origin: '*'` to allow requests from any location
- **Preflight caching**: Set `maxAge: 86400` (24 hours) to reduce preflight requests

### 2. Updated Helmet Security (`server.js`)
- **CSP directives updated**:
  - Added `blob:` to `imgSrc` for thumbnail support
  - Added `mediaSrc` directive for video streaming
  - Changed `connectSrc` to `["'self'", "*"]` to allow API calls from anywhere
- **Disabled COEP**: Set `crossOriginEmbedderPolicy: false` for better cross-origin support
- **Maintained CORP**: Kept `crossOriginResourcePolicy: { policy: "cross-origin" }`

### 3. Download Route CORS Headers (`routes/download.js`)
- Added explicit CORS headers to video streaming response:
  ```javascript
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type, Content-Disposition');
  ```

## Testing

### Local Testing
1. Start the server: `npm start`
2. Open browser console and test:
```javascript
fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(console.log);
```

### Production Testing (After Deployment)
1. Open browser console on any website
2. Test the API:
```javascript
fetch('https://your-app.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log);
```

## Deployment to Render

### Option 1: Git Push (Recommended)
```bash
git add .
git commit -m "Fix CORS for cross-region access"
git push origin main
```
Render will automatically redeploy.

### Option 2: Manual Deploy
1. Go to your Render dashboard
2. Select your service
3. Click "Manual Deploy" → "Deploy latest commit"

## Verification

After deployment, test from India:
1. Visit your Render URL: `https://your-app.onrender.com`
2. Paste a YouTube Shorts URL
3. Click Download
4. The CORS error should be resolved

## Additional Notes

- **Security**: Using `origin: '*'` is safe for public APIs like this downloader
- **Performance**: Preflight caching reduces unnecessary OPTIONS requests
- **Compatibility**: Works across all regions and browsers
- **Rate Limiting**: Still active (10 requests per 15 minutes)

## Troubleshooting

If CORS errors persist:
1. Clear browser cache
2. Check browser console for specific error messages
3. Verify Render deployment completed successfully
4. Test the `/api/health` endpoint first
5. Check Render logs for server errors

## Files Modified
- `backend/server.js` - Enhanced CORS and security configuration
- `backend/routes/download.js` - Added explicit CORS headers to download endpoint
