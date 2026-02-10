# 🚀 How to Deploy on Render (Free)

Follow these simple steps:

1.  **Sign Up/Log In**: Go to [render.com](https://render.com) and log in with your GitHub account.

2.  **Create New Web Service**:
    *   Click **New +** > **Web Service**.
    *   Connect your GitHub repository (the one with your `shorts downloader` code).
    *   Give it a name (e.g., `shorts-downloader`).

3.  **App Configuration**:
    *   **Region**: Closest to you (e.g., `Singapore` or `Frankfurt`).
    *   **Branch**: `main` (or whatever your branch is).
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start` (This is already set correctly!)

4.  **Important Settings**:
    *   Scroll down to **Advanced** > **Add Environment Variable**.
    *   Key: `NODE_ENV`
    *   Value: `production`

5.  **Click Create Web Service**: Render will start building and deploying your app!

---

**That's it!** 🎉 Render will spin up your server.

**Wait 1-2 minutes**, and you'll get a live URL (e.g., `https://shorts-downloader.onrender.com`).
**Note**: The free plan spins down after inactivity, so the first request might take a few seconds to wake up. This is normal!
