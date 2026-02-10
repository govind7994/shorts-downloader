# YouTube Shorts & Instagram Reels Downloader

A professional, production-ready web application for downloading YouTube Shorts and Instagram Reels videos. Built with modern web technologies, featuring a clean UI, mobile-first design, and robust security measures.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)

## ✨ Features

- 🚀 **Lightning Fast** - Download videos in seconds
- 📱 **Mobile-First Design** - Responsive UI that works on all devices
- 🎨 **Modern UI** - Beautiful gradient design with Tailwind CSS
- 🔒 **Secure** - Rate limiting, helmet security headers, CORS protection
- 💾 **No Storage** - Videos stream directly to users (never stored on server)
- 🎯 **Auto-Detection** - Automatically detects YouTube or Instagram URLs
- ⚡ **Best Quality** - Downloads highest available video quality
- 🆓 **100% Free** - No registration, no ads, no hidden fees

## 🛠️ Tech Stack

### Frontend
- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- Responsive & Mobile-First

### Backend
- Node.js (v16+)
- Express.js
- @distube/ytdl-core (YouTube downloads)
- Helmet (Security)
- Express Rate Limit (Anti-abuse)
- CORS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

Check your versions:
```bash
node --version
npm --version
```

## 🚀 Quick Start

### 1. Installation

Clone or download this repository, then install dependencies:

```bash
# Navigate to project directory
cd shorts-downloader

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` with your preferred settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Rate Limiting (15 minutes window, 10 requests max)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 3. Run the Application

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The application will be available at:
- **Local**: http://localhost:3000
- **Network**: http://YOUR_IP:3000

## 📁 Project Structure

```
shorts-downloader/
├── backend/
│   ├── routes/
│   │   └── download.js          # API routes for downloads
│   ├── services/
│   │   └── downloader.js        # Video download logic
│   ├── utils/
│   │   └── validators.js        # URL validation & platform detection
│   └── server.js                # Express server setup
├── frontend/
│   ├── index.html               # Main HTML page
│   └── app.js                   # Frontend JavaScript
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies & scripts
└── README.md                    # This file
```

## 🔧 Configuration

### Rate Limiting

Protect your server from abuse by configuring rate limits in `.env`:

```env
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=10       # Max 10 requests per window
```

### CORS Settings

Allow specific origins to access your API:

```env
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Port Configuration

Change the server port:

```env
PORT=3000
```

## 📡 API Endpoints

### Get Video Information
```http
POST /api/download/info
Content-Type: application/json

{
  "url": "https://youtube.com/shorts/abc123"
}
```

**Response:**
```json
{
  "success": true,
  "platform": "youtube",
  "info": {
    "title": "Video Title",
    "duration": "30",
    "thumbnail": "https://...",
    "author": "Channel Name",
    "viewCount": "1000000"
  }
}
```

### Download Video
```http
POST /api/download/video
Content-Type: application/json

{
  "url": "https://youtube.com/shorts/abc123"
}
```

**Response:** Video file stream (MP4)

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-02-10T12:00:00.000Z",
  "uptime": 3600
}
```

## 🎯 Supported Platforms

### ✅ YouTube Shorts
- `https://youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID`

### 🚧 Instagram Reels (Coming Soon)
- `https://instagram.com/reel/REEL_ID`
- `https://www.instagram.com/reel/REEL_ID`

## 🔒 Security Features

- **Helmet.js** - Sets secure HTTP headers
- **CORS** - Cross-Origin Resource Sharing protection
- **Rate Limiting** - Prevents abuse and DDoS attacks
- **Input Validation** - URL validation and sanitization
- **No File Storage** - Videos stream directly (never saved)
- **Error Handling** - Comprehensive error messages

## 🚨 Legal Disclaimer

⚠️ **IMPORTANT**: This tool is for **personal and educational use only**.

- We do **NOT** host, store, or distribute any videos
- All content rights belong to their respective owners
- Users must respect copyright laws and platform terms of service
- Downloading copyrighted content without permission may be illegal in your jurisdiction

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

### Video Download Fails
- Check if the video is public (not private/deleted)
- Verify the URL is correct
- Check your internet connection
- Some videos may be geo-restricted

### Rate Limit Errors
- Wait 15 minutes before trying again
- Adjust rate limits in `.env` if you're the server owner

## 📝 Development

### Install Dev Dependencies
```bash
npm install --save-dev nodemon
```

### Run in Development Mode
```bash
npm run dev
```

### Code Style
- Use ES6+ features
- Follow async/await pattern
- Add comments for complex logic
- Handle errors gracefully

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
ALLOWED_ORIGINS=https://yourdomain.com
```

### Recommended Hosting Platforms
- **Heroku** - Easy deployment with Git
- **DigitalOcean** - VPS with full control
- **AWS EC2** - Scalable cloud hosting
- **Vercel** - Serverless deployment
- **Railway** - Modern platform with auto-deploy

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Set appropriate rate limits
- [ ] Use HTTPS (SSL certificate)
- [ ] Set up monitoring/logging
- [ ] Configure firewall rules
- [ ] Regular security updates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [ytdl-core](https://github.com/distube/ytdl-core) - YouTube video downloader
- [Express.js](https://expressjs.com/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Helmet.js](https://helmetjs.github.io/) - Security middleware

## 📧 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing issues on GitHub
3. Create a new issue with detailed information

---

**Made with ❤️ for video enthusiasts**

⭐ Star this repo if you find it useful!
#   s h o r t s - d o w n l o a d e r  
 