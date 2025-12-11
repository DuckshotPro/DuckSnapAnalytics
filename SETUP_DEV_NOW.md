# Quick Setup - Add Dev Environment

## Step 1: Edit docker-compose.new.yml

SSH into your server and edit the file:

```bash
ssh cira@74.208.227.161
sudo nano /home/cira/docker-compose.new.yml
```

Scroll to the **END** of the file (after the `ducksnap-worker` section) and paste this:

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
      - PORT=5000
      - APP_URL=https://dev.duckshotanalytics.com
      - PAYPAL_MODE=sandbox
      - SESSION_SECRET=${DEV_SESSION_SECRET:-dev_session_secret_change_me}
```

Save with `Ctrl+O`, `Enter`, then exit with `Ctrl+X`

## Step 2: Create Dev Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create dev database
CREATE DATABASE duckshot_dev;
GRANT ALL PRIVILEGES ON DATABASE duckshot_dev TO your_postgres_user;
\q
```

## Step 3: Create Dev Directory

```bash
cd /home/cira
git clone https://github.com/DuckshotPro/DuckSnapAnalytics.git dev-DuckSnapAnalytics
cd dev-DuckSnapAnalytics

# Create .env file for dev-specific settings
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
PAYPAL_MODE=sandbox
EOF
```

## Step 4: Deploy Dev Container

```bash
cd /home/cira
podman-compose -f docker-compose.new.yml up -d --build site-duckshotanalytics-dev
```

## Step 5: Check Status

```bash
# View all containers
podman ps

# Check dev container logs
podman logs -f site-duckshotanalytics-dev
```

## Step 6: Test URLs

After a few minutes for SSL provisioning:

```bash
# Test production
curl -I https://duckshotanalytics.com

# Test dev
curl -I https://dev.duckshotanalytics.com
```

Both should return `200 OK` with SSL!

---

## Troubleshooting

### Container fails to start:
```bash
podman logs site-duckshotanalytics-dev
```

### Need to rebuild:
```bash
podman-compose -f /home/cira/docker-compose.new.yml build --no-cache site-duckshotanalytics-dev
podman-compose -f /home/cira/docker-compose.new.yml up -d site-duckshotanalytics-dev
```

### Check DNS:
```bash
nslookup dev.duckshotanalytics.com
# Should return: 74.208.227.161
```

---

## 🎉 Once Working

You'll have:
- ✅ https://duckshotanalytics.com (Production)
- ✅ https://dev.duckshotanalytics.com (Development)
- Both with automatic SSL!

Deploy updates:
```bash
# Production
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
git pull
podman restart site-duckshotanalytics

# Dev
cd /home/cira/dev-DuckSnapAnalytics
git pull
podman restart site-duckshotanalytics-dev
```
