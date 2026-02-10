# 🚀 Production Deployment Checklist

Use this checklist before deploying your video downloader to production.

## 📋 Pre-Deployment Checklist

### ✅ Environment Configuration

- [ ] **Set NODE_ENV to production**
  ```env
  NODE_ENV=production
  ```

- [ ] **Configure production port**
  ```env
  PORT=3000  # or your preferred port
  ```

- [ ] **Set production CORS origins**
  ```env
  ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
  ```

- [ ] **Adjust rate limits for production traffic**
  ```env
  RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
  RATE_LIMIT_MAX_REQUESTS=10   # Adjust based on expected traffic
  ```

### ✅ Security

- [ ] **Remove .env from version control**
  - Verify `.env` is in `.gitignore`
  - Never commit sensitive data

- [ ] **Use HTTPS (SSL/TLS)**
  - Obtain SSL certificate (Let's Encrypt, Cloudflare, etc.)
  - Configure reverse proxy (Nginx, Apache)
  - Redirect HTTP to HTTPS

- [ ] **Update Content Security Policy**
  - Review CSP headers in `backend/server.js`
  - Adjust for your domain

- [ ] **Enable firewall**
  - Only allow necessary ports (80, 443, SSH)
  - Block direct access to Node.js port

- [ ] **Set up DDoS protection**
  - Use Cloudflare or similar service
  - Configure rate limiting at network level

### ✅ Performance

- [ ] **Use process manager**
  ```bash
  npm install -g pm2
  pm2 start backend/server.js --name "video-downloader"
  pm2 startup
  pm2 save
  ```

- [ ] **Enable compression**
  - Add compression middleware to Express
  - Configure Nginx gzip

- [ ] **Set up CDN**
  - Serve static files via CDN
  - Cache frontend assets

- [ ] **Optimize images and assets**
  - Minify CSS/JS (if not using CDN)
  - Optimize any images

### ✅ Monitoring & Logging

- [ ] **Set up logging**
  - Use Winston or Morgan for structured logs
  - Log to file and/or external service

- [ ] **Configure error tracking**
  - Sentry, Rollbar, or similar
  - Track API errors and crashes

- [ ] **Set up uptime monitoring**
  - UptimeRobot, Pingdom, or similar
  - Monitor /api/health endpoint

- [ ] **Configure analytics** (optional)
  - Google Analytics
  - Plausible Analytics
  - Custom analytics

### ✅ Database & Storage

- [ ] **Verify no video storage**
  - Confirm videos are streamed only
  - No temp files left behind

- [ ] **Set up log rotation**
  - Prevent logs from filling disk
  - Use logrotate or similar

### ✅ Backup & Recovery

- [ ] **Backup configuration files**
  - .env (securely)
  - Server configuration
  - SSL certificates

- [ ] **Document recovery procedures**
  - How to restore from backup
  - Emergency contacts

### ✅ Legal & Compliance

- [ ] **Add Terms of Service**
  - Create TOS page
  - Link from footer

- [ ] **Add Privacy Policy**
  - Explain data handling
  - GDPR compliance if applicable

- [ ] **Display legal disclaimer**
  - Already included in footer
  - Make it prominent

- [ ] **Set up abuse reporting**
  - Email or form for reports
  - Process for handling complaints

### ✅ Testing

- [ ] **Test on production environment**
  - Download various videos
  - Test error scenarios
  - Verify rate limiting

- [ ] **Mobile testing**
  - iOS Safari
  - Android Chrome
  - Various screen sizes

- [ ] **Browser compatibility**
  - Chrome, Firefox, Safari, Edge
  - Test on different OS

- [ ] **Load testing**
  - Simulate concurrent users
  - Test rate limiting
  - Monitor server resources

### ✅ Documentation

- [ ] **Update README.md**
  - Production URLs
  - Deployment instructions
  - Contact information

- [ ] **Create runbook**
  - Common issues and solutions
  - Restart procedures
  - Monitoring dashboards

- [ ] **Document API**
  - Already in README
  - Consider API documentation tool

## 🌐 Deployment Platforms

### Heroku
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set RATE_LIMIT_MAX_REQUESTS=10
```

### DigitalOcean
1. Create a Droplet (Ubuntu 20.04+)
2. Install Node.js and npm
3. Clone repository
4. Install dependencies
5. Set up Nginx reverse proxy
6. Configure SSL with Let's Encrypt
7. Use PM2 for process management

### AWS EC2
1. Launch EC2 instance
2. Configure security groups
3. Install Node.js
4. Deploy application
5. Set up Load Balancer (optional)
6. Configure Auto Scaling (optional)

### Vercel (Serverless)
```bash
npm install -g vercel
vercel login
vercel
```

### Railway
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

## 🔧 Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 PM2 Commands

```bash
# Start application
pm2 start backend/server.js --name video-downloader

# View logs
pm2 logs video-downloader

# Monitor
pm2 monit

# Restart
pm2 restart video-downloader

# Stop
pm2 stop video-downloader

# Auto-start on boot
pm2 startup
pm2 save
```

## 🚨 Post-Deployment

- [ ] **Verify HTTPS is working**
- [ ] **Test all functionality**
- [ ] **Check error logs**
- [ ] **Monitor server resources**
- [ ] **Test rate limiting**
- [ ] **Verify analytics tracking**
- [ ] **Test mobile experience**
- [ ] **Check SEO (Google Search Console)**

## 📈 Ongoing Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review analytics

### Weekly
- [ ] Check disk space
- [ ] Review rate limit logs
- [ ] Update dependencies (security patches)

### Monthly
- [ ] Full security audit
- [ ] Performance review
- [ ] Backup verification
- [ ] Update documentation

## 🆘 Emergency Procedures

### Server Down
1. Check PM2 status: `pm2 status`
2. Check logs: `pm2 logs`
3. Restart: `pm2 restart video-downloader`
4. If persistent, check server resources

### High Traffic
1. Monitor server resources
2. Adjust rate limits if needed
3. Consider scaling (more instances)
4. Enable CDN caching

### Security Incident
1. Take server offline if critical
2. Review logs for suspicious activity
3. Update security measures
4. Notify users if data affected

---

**Ready to deploy? Good luck! 🚀**

For questions or issues, refer to README.md or create an issue on GitHub.
