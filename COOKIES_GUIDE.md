# 🍪 How to Fix "Bot" Error on Render

This error happens because YouTube blocks server IP addresses. You need to give the app your "Identity" (Cookies) to bypass this.

## Step 1: Get Cookies
1. Open this link in Chrome/Edge: [EditThisCookie Extension](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg) and install it.
2. Go to **[YouTube.com](https://www.youtube.com)**.
3. Make sure you are **Logged In**.
4. Click the **EditThisCookie** icon (cookie button) in your browser toolbar.
5. Click the **Export** button (➜ icon, 4th from left).
   * *This copies your cookies to your clipboard.*

## Step 2: Add to Render
1. Go to your **[Render Dashboard](https://dashboard.render.com)**.
2. Click on your `shorts-downloader` service.
3. Click on **Environment** in the side query.
4. Click **Add Environment Variable**.
5. Fill in the details:
   * **Key**: `YOUTUBE_COOKIES`
   * **Value**: *[Paste the copied text here]*
6. Click **Save Changes**.

## 🚀 That's it!
Render will automatically restart. The downloader will now treat requests as "You" and bypass the bot check.
