# DuckSnapAnalytics - Server Deployment Guide

**Server IP**: `74.208.227.161`  
**User**: `cira`  
**Production Path**: `/home/cira/Duckshotanalytics.com-DuckSnapAnalytics`

---

## Current Setup Status

### ✅ What's Already Done:
1. Git repository configured with `server` remote
2. Project directory exists on server: `/home/cira/Duckshotanalytics.com-DuckSnapAnalytics`
3. Basic nginx installed (using default config)
4. Node.js and dependencies installed

### ⚠️ What Needs Setup:
1. **Nginx reverse proxy** configurations for:
   - Production: `duckshotanalytics.com`
   - Dev: `dev.duckshotanalytics.com`
2. **PM2 process manager** (currently not installed)
3. **SSL certificates** (Let's Encrypt)
4. **Environment variables** on server
5. **Dev environment** separate from production

---

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────┐
│              nginx (Port 80/443)                        │
│  Handles SSL, Static Files, Reverse Proxy              │
└────────────┬──────────────────┬─────────────────────────┘
             │                  │
    ┌────────▼──────┐  ┌───────▼──────┐
    │  Production   │  │     Dev      │
    │  duckshotana  │  │ dev.duckshot │
    │  lytics.com   │  │ analytics.com│
    │               │  │              │
    │  Port: 5000   │  │  Port: 5001  │
    │  PM2: prod    │  │  PM2: dev    │
    └───────────────┘  └──────────────┘
```

---

## Step-by-Step Setup

### 1. Install PM2 (Process Manager)

SSH into your server and run:

```bash
ssh cira@74.208.227.161

# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it gives you
```

### 2. Create Dev Environment

```bash
# Create a separate dev directory
cd /home/cira
cp -r Duckshotanalytics.com-DuckSnapAnalytics dev-DuckSnapAnalytics

# Or clone from git
git clone https://github.com/DuckshotPro/DuckSnapAnalytics.git dev-DuckSnapAnalytics
```

### 3. Setup Environment Files

**Production** (`/home/cira/Duckshotanalytics.com-DuckSnapAnalytics/.env`):
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/duckshots_prod
APP_URL=https://duckshotanalytics.com
SESSION_SECRET=your_production_secret
PAYPAL_MODE=live
# ... other production vars
```

**Dev** (`/home/cira/dev-DuckSnapAnalytics/.env`):
```env
NODE_ENV=development
PORT=5001
DATABASE_URL=postgresql://username:password@localhost:5432/duckshots_dev
APP_URL=https://dev.duckshotanalytics.com
SESSION_SECRET=your_dev_secret
PAYPAL_MODE=sandbox
# ... other dev vars
```

### 4. Create Nginx Configuration Files

See the attached nginx config files in this repo:
- `deploy/nginx/duckshotanalytics.com.conf` - Production
- `deploy/nginx/dev.duckshotanalytics.com.conf` - Development

Install them:
```bash
# Copy configs to nginx
sudo cp deploy/nginx/*.conf /etc/nginx/sites-available/

# Enable the sites
sudo ln -s /etc/nginx/sites-available/duckshotanalytics.com.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/dev.duckshotanalytics.com.conf /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 5. Start Applications with PM2

**Production:**
```bash
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
npm install
npm run build
pm2 start dist/index.js --name "duckshot-prod" --env production
```

**Dev:**
```bash
cd /home/cira/dev-DuckSnapAnalytics
npm install
pm2 start --name "duckshot-dev" --interpreter=none npm -- run dev
```

**Save PM2 processes:**
```bash
pm2 save
```

### 6. Setup SSL Certificates

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get certificates for both domains
sudo certbot --nginx -d duckshotanalytics.com -d www.duckshotanalytics.com
sudo certbot --nginx -d dev.duckshotanalytics.com

# Auto-renewal is setup automatically
```

---

## Adding Git Remote for Dev

On your **local Windows machine**:

```bash
cd c:\Users\420du\DuckSnapAnalytics

# Add dev remote
git remote add dev cira@74.208.227.161:/home/cira/dev-DuckSnapAnalytics
```

---

## Deployment Workflows

### Deploy to Production:
```bash
# 1. Commit changes locally
git add .
git commit -m "Your changes"

# 2. Push to GitHub (backup)
git push origin main

# 3. Push to production server
git push server main

# 4. SSH and restart
ssh cira@74.208.227.161
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
git pull
npm install
npm run build
pm2 restart duckshot-prod
```

### Deploy to Dev:
```bash
# 1. Push to dev
git push dev develop  # or main

# 2. SSH and restart
ssh cira@74.208.227.161
cd /home/cira/dev-DuckSnapAnalytics
git pull
npm install
pm2 restart duckshot-dev
```

---

## Monitoring

```bash
# View all PM2 processes
pm2 list

# View logs
pm2 logs duckshot-prod
pm2 logs duckshot-dev

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Quick Commands Reference

```bash
# Start/Stop/Restart
pm2 start duckshot-prod
pm2 stop duckshot-prod
pm2 restart duckshot-prod

# Check nginx status
sudo systemctl status nginx
sudo nginx -t  # Test config

# View running processes
pm2 monit

# Clear logs
pm2 flush
```

---

## Next Steps

1. Run through steps 1-6 above
2. Test both dev and production URLs
3. Setup automatic deployments if desired
4. Configure database backups
5. Setup monitoring/alerts
