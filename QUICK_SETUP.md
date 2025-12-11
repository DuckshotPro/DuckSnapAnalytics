# Quick Setup Guide - DuckSnapAnalytics Server

## What You Have Now

✅ **Server**: `74.208.227.161` (cira@server)  
✅ **Production folder**: `/home/cira/Duckshotanalytics.com-DuckSnapAnalytics`  
✅ **Git remotes**: GitHub + Server  
⚠️ **Nginx**: Default config (needs reverse proxy setup)  
⚠️ **PM2**: Not installed yet  

## What You Need

Two environments running:
- **Production** → `duckshotanalytics.com` (Port 5000)
- **Development** → `dev.duckshotanalytics.com` (Port 5001)

## Quick Setup (3 Options)

### Option 1: Automated Setup (Recommended) ⚡

**Step 1:** Push deployment files to server
```bash
# On your Windows machine
cd c:\Users\420du\DuckSnapAnalytics
git add deploy/
git commit -m "Add deployment configs"
git push server main
```

**Step 2:** Run setup script on server
```bash
# SSH into server
ssh cira@74.208.227.161

# Navigate to project
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics

# Run setup script
bash deploy/setup-server.sh
```

**That's it!** The script will:
- Install PM2
- Create dev environment
- Configure nginx
- Setup SSL (optional)
- Start both apps

---

### Option 2: Manual Setup (Step by Step) 🔧

**1. Install PM2:**
```bash
ssh cira@74.208.227.161
sudo npm install -g pm2
pm2 startup
# Run the command it gives you
```

**2. Setup nginx:**
```bash
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
sudo cp deploy/nginx/*.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/duckshotanalytics.com.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/dev.duckshotanalytics.com.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**3. Create dev environment:**
```bash
cd /home/cira
git clone https://github.com/DuckshotPro/DuckSnapAnalytics.git dev-DuckSnapAnalytics
cd dev-DuckSnapAnalytics
npm install
```

**4. Create .env files for both:**

Production (`.env` in `/home/cira/Duckshotanalytics.com-DuckSnapAnalytics/`):
```env
NODE_ENV=production
PORT=5000
APP_URL=https://duckshotanalytics.com
DATABASE_URL=your_prod_database_url
SESSION_SECRET=your_production_secret
PAYPAL_MODE=live
```

Dev (`.env` in `/home/cira/dev-DuckSnapAnalytics/`):
```env
NODE_ENV=development
PORT=5001
APP_URL=https://dev.duckshotanalytics.com
DATABASE_URL=your_dev_database_url
SESSION_SECRET=your_dev_secret
PAYPAL_MODE=sandbox
```

**5. Build and start:**
```bash
# Production
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
npm run build
pm2 start dist/index.js --name "duckshot-prod"

# Dev
cd /home/cira/dev-DuckSnapAnalytics
pm2 start npm --name "duckshot-dev" -- run dev

# Save PM2 config
pm2 save
```

**6. Setup SSL:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d duckshotanalytics.com -d www.duckshotanalytics.com
sudo certbot --nginx -d dev.duckshotanalytics.com
```

---

### Option 3: Just Test nginx First 🧪

If you just want to see if nginx reverse proxy works:

**1. Start app manually:**
```bash
ssh cira@74.208.227.161
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
npm run dev
# Leave this running...
```

**2. In another terminal, setup nginx:**
```bash
ssh cira@74.208.227.161
sudo cp /home/cira/Duckshotanalytics.com-DuckSnapAnalytics/deploy/nginx/duckshotanalytics.com.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/duckshotanalytics.com.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**3. Test:**
Visit `http://74.208.227.161` in browser (should proxy to your app)

---

## After Setup

### Deploy Updates:

**To Production:**
```bash
# From your Windows machine
git push server main

# SSH and restart
ssh cira@74.208.227.161
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
git pull
npm install
npm run build
pm2 restart duckshot-prod
```

**To Dev:**
```bash
# From your Windows machine
git push dev main

# SSH and restart
ssh cira@74.208.227.161
cd /home/cira/dev-DuckSnapAnalytics
git pull
npm install
pm2 restart duckshot-dev
```

### Monitor:
```bash
pm2 list                    # See all apps
pm2 logs duckshot-prod      # View production logs
pm2 logs duckshot-dev       # View dev logs
pm2 monit                   # Real-time monitoring
```

---

## DNS Setup (Important!)

Make sure your DNS is pointed to `74.208.227.161`:
- `duckshotanalytics.com` → A record → `74.208.227.161`
- `www.duckshotanalytics.com` → A record → `74.208.227.161`
- `dev.duckshotanalytics.com` → A record → `74.208.227.161`

---

## Troubleshooting

**nginx won't reload:**
```bash
sudo nginx -t  # Check for errors
sudo tail -f /var/log/nginx/error.log
```

**App not starting:**
```bash
pm2 logs duckshot-prod --err
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
cat .env  # Check environment variables
```

**Port already in use:**
```bash
sudo netstat -tlnp | grep :5000
sudo kill <PID>
```

---

## Next Steps After Setup

1. ✅ Test both URLs work
2. ✅ Verify SSL certificates
3. ✅ Test git deployment workflow
4. ✅ Setup database backups
5. ✅ Configure monitoring/alerts
6. ✅ Test PayPal integration on both environments

Need help? Check `docs/SERVER_DEPLOYMENT.md` for detailed info!
