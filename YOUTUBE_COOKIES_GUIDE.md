# Fix YouTube Bot Detection Error

## Problem
YouTube is blocking your server with the error:
```
Error getting YouTube video info: Sign in to confirm you're not a bot
Error fetching video info: Error: Video unavailable or private (Check cookies/IP)
```

This happens because YouTube detects automated requests and requires authentication.

## Solution: Add YouTube Cookies

### Method 1: Using Browser Extension (Recommended - Easiest)

#### Step 1: Install Cookie Editor Extension
- **Chrome/Edge**: [Cookie Editor](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)
- **Firefox**: [Cookie Editor](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/)

#### Step 2: Get YouTube Cookies
1. **Open YouTube** in your browser: https://www.youtube.com
2. **Sign in** to your YouTube/Google account (if not already)
3. **Click the Cookie Editor extension** icon
4. **Click "Export"** → Choose **"JSON"** format
5. **Copy** the JSON output

#### Step 3: Format the Cookies
The exported cookies will look like this:
```json
[
  {"name": "VISITOR_INFO1_LIVE", "value": "xxx", "domain": ".youtube.com"},
  {"name": "CONSENT", "value": "xxx", "domain": ".youtube.com"},
  ...
]
```

You need to **filter only YouTube cookies** (domain contains "youtube.com").

#### Step 4: Add to Render Environment Variables
1. Go to your **Render Dashboard**: https://dashboard.render.com
2. Select your **shorts-downloader** service
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Set:
   - **Key**: `YOUTUBE_COOKIES`
   - **Value**: Paste the JSON array of cookies (must be valid JSON)
6. Click **"Save Changes"**
7. Render will **automatically redeploy**

---

### Method 2: Using Browser DevTools (Manual)

#### Step 1: Open YouTube
1. Go to https://www.youtube.com
2. Sign in to your account

#### Step 2: Open DevTools
- Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
- Or `Cmd+Option+I` (Mac)

#### Step 3: Get Cookies
1. Go to **"Application"** tab (Chrome) or **"Storage"** tab (Firefox)
2. Expand **"Cookies"** in the left sidebar
3. Click on **"https://www.youtube.com"**
4. You'll see a list of cookies

#### Step 4: Copy Important Cookies
Copy these specific cookies (if available):
- `VISITOR_INFO1_LIVE`
- `CONSENT`
- `PREF`
- `__Secure-1PSID`
- `__Secure-3PSID`
- `HSID`
- `SSID`
- `APISID`
- `SAPISID`

#### Step 5: Format as JSON
Create a JSON array like this:
```json
[
  {
    "name": "VISITOR_INFO1_LIVE",
    "value": "YOUR_VALUE_HERE",
    "domain": ".youtube.com"
  },
  {
    "name": "CONSENT",
    "value": "YOUR_VALUE_HERE",
    "domain": ".youtube.com"
  }
]
```

**Important**: 
- Replace `YOUR_VALUE_HERE` with actual cookie values
- Keep the entire JSON on **one line** when adding to Render
- Ensure it's **valid JSON** (use https://jsonlint.com to validate)

---

### Method 3: Quick Test with Minimal Cookies (Temporary Fix)

For testing, you can try with just these minimal cookies:

```json
[{"name":"CONSENT","value":"YES+","domain":".youtube.com"},{"name":"VISITOR_INFO1_LIVE","value":"","domain":".youtube.com"}]
```

**Note**: This may not always work, but it's worth trying for quick testing.

---

## Adding Cookies to Render

### Step-by-Step:

1. **Login to Render**: https://dashboard.render.com
2. **Select your service**: "shorts-downloader"
3. **Go to "Environment" tab**
4. **Click "Add Environment Variable"**
5. **Add the variable**:
   ```
   Key: YOUTUBE_COOKIES
   Value: [{"name":"VISITOR_INFO1_LIVE","value":"xxx",...}]
   ```
6. **Click "Save Changes"**
7. **Wait for auto-redeploy** (2-3 minutes)

---

## Testing After Adding Cookies

### Test 1: Health Check
```bash
curl https://your-app.onrender.com/api/health
```

### Test 2: Video Info
```bash
curl -X POST https://your-app.onrender.com/api/download/info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/shorts/YOUR_VIDEO_ID"}'
```

### Test 3: Download Video
Visit your app and try downloading a YouTube Short.

---

## Important Notes

### Cookie Expiration
- YouTube cookies **expire** after some time (usually 1-6 months)
- You'll need to **refresh them periodically**
- If downloads stop working, **update the cookies**

### Security
- **Never commit cookies to Git** (they contain authentication tokens)
- Only add them as **environment variables** in Render
- Use a **dedicated YouTube account** (not your personal one)

### Privacy
- Cookies are tied to your YouTube account
- Consider creating a **separate Google account** for this purpose
- This ensures your personal account isn't affected

---

## Alternative Solution: Use OAuth2 (Advanced)

If you want a more permanent solution, you can implement OAuth2 authentication with YouTube API. This requires:
1. Creating a Google Cloud Project
2. Enabling YouTube Data API v3
3. Implementing OAuth2 flow
4. Using API keys instead of cookies

This is more complex but more reliable long-term.

---

## Troubleshooting

### "Invalid JSON" Error in Render
- Ensure the JSON is **properly formatted**
- Use https://jsonlint.com to validate
- Remove any line breaks (keep it on one line)
- Escape any special characters

### Still Getting Bot Error
- Try adding **more cookies** (all YouTube cookies)
- Ensure cookies are from a **signed-in session**
- Try using a **different Google account**
- Check if cookies have **expired**

### Cookies Not Working
- Make sure you're **signed in** to YouTube when exporting
- Try **refreshing** the YouTube page before exporting
- Use **incognito mode** to test if it's a cache issue

---

## Quick Reference: Cookie Editor Export

1. Install Cookie Editor extension
2. Go to YouTube.com (signed in)
3. Click extension icon
4. Click "Export" → "JSON"
5. Copy the output
6. Add to Render as `YOUTUBE_COOKIES` environment variable
7. Save and wait for redeploy

---

## Need Help?

If you're still having issues:
1. Check Render logs for specific error messages
2. Verify the JSON format of your cookies
3. Try with a fresh set of cookies
4. Ensure you're signed in to YouTube when exporting

---

**Next Steps**: Follow Method 1 above to get your cookies and add them to Render!
