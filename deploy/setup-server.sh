#!/bin/bash
# Setup script for DuckSnapAnalytics server deployment
# Run this on your server: bash setup-server.sh

set -e

echo "🚀 DuckSnapAnalytics Server Setup"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as correct user
if [ "$USER" != "cira" ]; then
    echo -e "${YELLOW}Warning: This script should be run as user 'cira'${NC}"
    echo "Currently running as: $USER"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 1. Install PM2
echo -e "${GREEN}Step 1: Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    pm2 startup
    echo -e "${YELLOW}⚠️  Please copy and run the command above, then re-run this script${NC}"
    exit 0
else
    echo "✓ PM2 already installed"
fi

# 2. Create dev environment
echo -e "${GREEN}Step 2: Setting up dev environment...${NC}"
if [ ! -d "/home/cira/dev-DuckSnapAnalytics" ]; then
    cd /home/cira
    git clone https://github.com/DuckshotPro/DuckSnapAnalytics.git dev-DuckSnapAnalytics
    echo "✓ Dev environment cloned"
else
    echo "✓ Dev environment already exists"
fi

# 3. Install dependencies for both environments
echo -e "${GREEN}Step 3: Installing dependencies...${NC}"

# Production
echo "  Installing production dependencies..."
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
npm install

# Dev
echo "  Installing dev dependencies..."
cd /home/cira/dev-DuckSnapAnalytics
npm install

echo "✓ Dependencies installed"

# 4. Setup nginx configs
echo -e "${GREEN}Step 4: Setting up nginx configurations...${NC}"

# Copy nginx configs
sudo cp /home/cira/Duckshotanalytics.com-DuckSnapAnalytics/deploy/nginx/*.conf /etc/nginx/sites-available/

# Enable sites
sudo ln -sf /etc/nginx/sites-available/duckshotanalytics.com.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/dev.duckshotanalytics.com.conf /etc/nginx/sites-enabled/

# Test nginx config
echo "  Testing nginx configuration..."
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
echo "✓ nginx configured and reloaded"

# 5. Setup SSL (optional)
echo -e "${GREEN}Step 5: SSL Setup (optional)${NC}"
read -p "Do you want to setup SSL with Let's Encrypt now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Install certbot if not installed
    if ! command -v certbot &> /dev/null; then
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Get certificates
    echo "  Getting SSL certificates..."
    sudo certbot --nginx -d duckshotanalytics.com -d www.duckshotanalytics.com
    sudo certbot --nginx -d dev.duckshotanalytics.com
    echo "✓ SSL certificates installed"
fi

# 6. Build production
echo -e "${GREEN}Step 6: Building production application...${NC}"
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
npm run build
echo "✓ Production built"

# 7. Start applications with PM2
echo -e "${GREEN}Step 7: Starting applications with PM2...${NC}"

# Stop existing processes if running
pm2 stop duckshot-prod 2>/dev/null || true
pm2 stop duckshot-dev 2>/dev/null || true
pm2 delete duckshot-prod 2>/dev/null || true
pm2 delete duckshot-dev 2>/dev/null || true

# Start production
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
pm2 start dist/index.js --name "duckshot-prod" --env production

# Start dev
cd /home/cira/dev-DuckSnapAnalytics
pm2 start npm --name "duckshot-dev" -- run dev

# Save PM2 config
pm2 save

echo "✓ Applications started"

# 8. Show status
echo ""
echo -e "${GREEN}================================="
echo "Setup Complete! 🎉"
echo "=================================  ${NC}"
echo ""
echo "PM2 Status:"
pm2 list
echo ""
echo "URLs:"
echo "  Production: https://duckshotanalytics.com"
echo "  Development: https://dev.duckshotanalytics.com"
echo ""
echo "Useful commands:"
echo "  pm2 logs duckshot-prod    # View production logs"
echo "  pm2 logs duckshot-dev     # View dev logs"
echo "  pm2 restart duckshot-prod # Restart production"
echo "  pm2 restart duckshot-dev  # Restart dev"
echo ""
echo "To deploy updates:"
echo "  git push server main      # Push to production (from local machine)"
echo "  git push dev main         # Push to dev (from local machine)"
echo ""
