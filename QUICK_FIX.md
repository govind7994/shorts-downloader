# YouTube Shorts Downloader - Quick Fix Guide

## 🚨 Current Issue: YouTube Bot Detection

Your app is getting this error:
```
Error getting YouTube video info: Sign in to confirm you're not a bot
Error fetching video info: Error: Video unavailable or private (Check cookies/IP)
```

## ✅ Quick Solution (5 Minutes)

### Step 1: Get YouTube Cookies

**Option A: Using Cookie Editor Extension (Easiest)**
1. Install [Cookie Editor for Chrome](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)
2. Go to https://www.youtube.com and **sign in**
3. Click the **Cookie Editor** extension icon
4. Click **"Export"** → Choose **"JSON"**
5. **Copy** the entire JSON output

**Option B: Manual Method**
1. Go to https://www.youtube.com (signed in)
2. Press `F12` to open DevTools
3. Go to **Application** → **Cookies** → **https://www.youtube.com**
4. Manually create JSON format (see YOUTUBE_COOKIES_GUIDE.md)

---

### Step 2: Add Cookies to Render

1. **Login to Render**: https://dashboard.render.com
2. **Select your service**: Find "shorts-downloader"
3. **Go to Environment tab**
4. **Click "Add Environment Variable"**
5. **Add**:
   - **Key**: `YOUTUBE_COOKIES`
   - **Value**: Paste the JSON you copied (keep it on one line)
6. **Click "Save Changes"**
7. **Wait 2-3 minutes** for automatic redeployment

---

### Step 3: Test

After redeployment:
1. Visit your Render URL
2. Paste a YouTube Shorts URL
3. Try downloading
4. ✅ Should work now!

---

## 📋 Example Cookie Format

Your `YOUTUBE_COOKIES` environment variable should look like this (all on one line):

```json
[{"name":"VISITOR_INFO1_LIVE","value":"xxx","domain":".youtube.com"},{"name":"CONSENT","value":"xxx","domain":".youtube.com"}]
```

**Important**:
- Must be **valid JSON**
- Keep it on **one line** in Render
- Include **all YouTube cookies** for best results

---

## 🔍 Troubleshooting

### Still Getting Bot Error?
- ✅ Make sure you're **signed in** to YouTube when exporting cookies
- ✅ Verify the JSON is **valid** (use https://jsonlint.com)
- ✅ Try exporting cookies again (they might be expired)
- ✅ Check Render logs for specific error messages

### Invalid JSON Error?
- Remove any **line breaks** (keep JSON on one line)
- Ensure **proper quotes** (use double quotes `"`, not single `'`)
- **Validate** at https://jsonlint.com before adding to Render

### Cookies Expire?
- YouTube cookies typically last **1-6 months**
- When downloads stop working, **refresh the cookies**
- Consider using a **dedicated YouTube account**

---

## 📚 More Information

- **Detailed Guide**: See `YOUTUBE_COOKIES_GUIDE.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **CORS Fix**: See `CORS_FIX_README.md`

---

## 🎯 Summary

1. **Get cookies** from YouTube (using Cookie Editor extension)
2. **Add to Render** as `YOUTUBE_COOKIES` environment variable
3. **Wait for redeploy** (automatic)
4. **Test** your app

That's it! Your YouTube Shorts downloader should work perfectly after this. 🚀
