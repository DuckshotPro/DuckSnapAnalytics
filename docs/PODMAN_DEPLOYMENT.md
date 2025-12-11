# DuckSnapAnalytics - Podman Deployment Guide

**Your Setup**: Podman + nginx-proxy + Let's Encrypt auto-SSL  
**Server**: 74.208.227.161 (cira@server)

---

## 🎯 What You Have

Your server uses a **centralized reverse proxy** system with Podman:

```
                    nginx-proxy (Automated)
                            ↓
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    Production          Dev (NEW)         Other Sites
  duckshotanalytics  dev.duckshotana    customstripe.biz
       .com            lytics.com        crypt-ai-lytics.com
    Container           Container              etc.
    Port 5000          Port 5000
```

**Benefits:**
- ✅ Automatic SSL certificates (Let's Encrypt)
- ✅ Automatic reverse proxy routing  
- ✅ Just set `VIRTUAL_HOST` and it works!
- ✅ Already working for customstripe.biz

---

## 📋 Current Status

### ✅ Already in docker-compose.new.yml:

```yaml
site-duckshotanalytics:
  build:
    context: /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
    dockerfile: Dockerfile
  container_name: site-duckshotanalytics
  environment:
    - VIRTUAL_HOST=duckshotanalytics.com,www.duckshotanalytics.com
    - VIRTUAL_PORT=5000
    - LETSENCRYPT_HOST=duckshotanalytics.com,www.duckshotanalytics.com
    - DATABASE_URL=postgresql://...
    - REDIS_URL=redis://...
```

### ⚠️ Missing: Dev Environment

You don't have a dev container yet. Let's add it!

---

## 🚀 Quick Deploy (3 Steps)

### Step 1: Add Dev Container to docker-compose.new.yml

Add this section to `/home/cira/docker-compose.new.yml` (after the production duckshotanalytics section):

```yaml
  # ═════════════════════════════════════════════════════
  # Website: duckshotanalytics.com (DEV)
  # ═════════════════════════════════════════════════════
  site-duckshotanalytics-dev:
    build:
      context: /home/cira/dev-DuckSnapAnalytics
      dockerfile: Dockerfile
    container_name: site-duckshotanalytics-dev
    restart: always
    networks:
      - web-net
      - services-net
    depends_on:
      - dp1-db01
      - dp1-redis01
    environment:
      - VIRTUAL_HOST=dev.duckshotanalytics.com
      - VIRTUAL_PORT=5000
      - LETSENCRYPT_HOST=dev.duckshotanalytics.com
      - LETSENCRYPT_EMAIL=${ADMIN_EMAIL}
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@dp1-db01:5432/duckshot_dev
      - REDIS_URL=redis://:${REDIS_PASSWORD}@dp1-redis01:6379/1
      - NODE_ENV=development
      - PAYPAL_MODE=sandbox
      # Add dev-specific env vars here
```

### Step 2: Create Dev Environment

```bash
# SSH into server
ssh cira@74.208.227.161

# Clone dev environment
cd /home/cira
git clone https://github.com/DuckshotPro/DuckSnapAnalytics.git dev-DuckSnapAnalytics
cd dev-DuckSnapAnalytics

# Create .env file for dev
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
PAYPAL_MODE=sandbox
# Add your dev environment variables
EOF
```

### Step 3: Deploy with Podman Compose

```bash
# Navigate to compose file location
cd /home/cira

# Rebuild and restart all containers (or just the new ones)
podman-compose -f docker-compose.new.yml up -d --build site-duckshotanalytics site-duckshotanalytics-dev

# Or restart everything:
podman-compose -f docker-compose.new.yml down
podman-compose -f docker-compose.new.yml up -d
```

**That's it!** 🎉 
- nginx-proxy will automatically route traffic
- Let's Encrypt will automatically get SSL certificates
- Both URLs will work with HTTPS

---

## 🔄 Deployment Workflow

### Deploy to Production:

```bash
# From your Windows machine
git add .
git commit -m "Your changes"
git push server main

# SSH and rebuild
ssh cira@74.208.227.161
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
git pull
podman-compose -f /home/cira/docker-compose.new.yml up -d --build site-duckshotanalytics
```

### Deploy to Dev:

```bash
# From your Windows machine  
git push dev main

# SSH and rebuild
ssh cira@74.208.227.161
cd /home/cira/dev-DuckSnapAnalytics
git pull
podman-compose -f /home/cira/docker-compose.new.yml up -d --build site-duckshotanalytics-dev
```

---

## 📊 Monitoring

```bash
# View all containers
podman ps

# View specific container logs
podman logs -f site-duckshotanalytics
podman logs -f site-duckshotanalytics-dev

# View nginx-proxy logs (to see routing)
podman logs -f nginx-proxy

# Restart a container
podman restart site-duckshotanalytics

# Check if SSL is working
curl -I https://duckshotanalytics.com
curl -I https://dev.duckshotanalytics.com
```

---

## 🎛️ Environment Variables

Your containers get environment variables from:
1. **docker-compose.new.yml** - Compose-level vars
2. **Dockerfile** - Build-time vars  
3. **.env file** in project - Runtime vars

### Production vs Dev:

**Production** (`site-duckshotanalytics`):
- Uses production database: `duckshot_db`
- Redis DB 0: `redis://...@dp1-redis01:6379/0`
- PayPal: Live mode
- NODE_ENV: production

**Dev** (`site-duckshotanalytics-dev`):
- Uses dev database: `duckshot_dev`
- Redis DB 1: `redis://...@dp1-redis01:6379/1`
- PayPal: Sandbox mode
- NODE_ENV: development

---

## 🔧 Troubleshooting

### Container won't start:
```bash
# View build logs
podman logs site-duckshotanalytics

# Rebuild from scratch
podman-compose -f /home/cira/docker-compose.new.yml build --no-cache site-duckshotanalytics
podman-compose -f /home/cira/docker-compose.new.yml up -d site-duckshotanalytics
```

### SSL not working:
```bash
# Check Let's Encrypt companion logs
podman logs letsencrypt-companion

# Force renewal (if needed)
podman restart letsencrypt-companion
```

### DNS Issues:
Make sure DNS is pointing to your server:
```bash
# Check DNS
nslookup duckshotanalytics.com
nslookup dev.duckshotanalytics.com

# Should both return: 74.208.227.161
```

### Port conflicts:
```bash
# Check what's using port 5000
podman ps | grep 5000
```

---

## 📝 Next Steps

1. **Add dev container** to docker-compose.new.yml
2. **Create dev directory** on server
3. **Deploy both containers**  
4. **Test URLs**:
   - https://duckshotanalytics.com
   - https://dev.duckshotanalytics.com
5. **Setup git remote** for dev
6. **Test deployment workflow**

---

## 🌟 Advantages of Your Setup

Compared to manual nginx, your setup is BETTER because:

✅ **Automatic SSL** - No manual certbot commands  
✅ **Automatic routing** - Just set VIRTUAL_HOST  
✅ **Centralized management** - One docker-compose for all sites  
✅ **Easy scaling** - Add new sites easily  
✅ **Container isolation** - Each site is independent  
✅ **Consistent environment** - Dev matches production  

Your customstripe.biz setup proves this works perfectly! 🎯
