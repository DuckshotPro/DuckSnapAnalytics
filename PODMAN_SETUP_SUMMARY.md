# DuckSnapAnalytics - YOUR Server Setup (Podman)

## 🎉 Great News!

You already have an **AMAZING** setup that's BETTER than the nginx configs I initially created!

### Your Current Infrastructure:

```
                    🌐 nginx-proxy (Automated)
                    + Let's Encrypt (Auto-SSL)
                             ↓
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   Production             Dev (to add)      Your Other Sites
duckshotanalytics.com  dev.duckshotana   ✓ customstripe.biz
   (Port 5000)           lytics.com      ✓ crypt-ai-lytics.com
                        (Port 5000)      ✓ fortunetellertarot.cards
                                         ✓ greenvoice.us
```

---

## 📊 What I Found

### ✅ Already Working:
1. **Podman** container system
2. **nginx-proxy** - Automatically routes domains
3. **Let's Encrypt companion** - Auto SSL certificates
4. **Production** - `site-duckshotanalytics` container defined
5. **Database** - Shared PostgreSQL (`dp1-db01`)
6. **Redis** - Shared Redis (`dp1-redis01`)

### 📝 Your Deployment Pattern (from customstripe.biz):

```yaml
site-customstripe:
  environment:
    - VIRTUAL_HOST=customstripe.biz,www.customstripe.biz  # ← nginx-proxy uses this
    - LETSENCRYPT_HOST=customstripe.biz,www.customstripe.biz  # ← Auto SSL!
    - VIRTUAL_PORT=5000

site-customstripe-dev:
  environment:
    - VIRTUAL_HOST=dev.customstripe.biz  # ← Separate dev URL
    - LETSENCRYPT_HOST=dev.customstripe.biz
```

**You already have this pattern working!** We just need to add the dev container for DuckSnapAnalytics.

---

## 🚀 Quick Setup (2 Steps)

### 1. Add Dev Container

Add the contents of `deploy/podman/dev-container.yml` to your `/home/cira/docker-compose.new.yml`

### 2. Deploy

```bash
# SSH into server
ssh cira@74.208.227.161

# Create dev directory
cd /home/cira
git clone https://github.com/DuckshotPro/DuckSnapAnalytics.git dev-DuckSnapAnalytics

# Deploy both containers
podman-compose -f docker-compose.new.yml up -d --build site-duckshotanalytics site-duckshotanalytics-dev
```

**Done!** SSL certificates will be automatically generated for both:
- ✅ https://duckshotanalytics.com
- ✅ https://dev.duckshotanalytics.com

---

## 📁 Files Created for You

1. **`docs/PODMAN_DEPLOYMENT.md`** - Full deployment guide
2. **`deploy/podman/dev-container.yml`** - Dev container config to add
3. **`QUICK_SETUP.md`** - Previous nginx guide (IGNORE - use Podman instead)

---

## 🎯 Why Your Setup is Better

| Feature | Manual nginx | Your Podman Setup |
|---------|-------------|-------------------|
| SSL Setup | Manual certbot | ✅ Automatic |
| Domain Routing | Edit nginx configs | ✅ Set VIRTUAL_HOST |
| New Site | Multiple steps | ✅ Add container block |
| SSL Renewal | Cron job | ✅ Automatic |
| Isolation | Systemd services | ✅ Containers |
| Consistency | Can drift | ✅ Same pattern everywhere |

You've already proven this works with customstripe.biz! 🎉

---

## 🔄 Your Deployment Workflow

### Normal Development:
```bash
# 1. Work locally
# 2. Push to GitHub
git push origin main

# 3. Deploy to dev
git push dev main
ssh cira@74.208.227.161
cd /home/cira/dev-DuckSnapAnalytics && git pull
podman restart site-duckshotanalytics-dev

# 4. Test on dev.duckshotanalytics.com
# 5. If good, deploy to production
git push server main
ssh cira@74.208.227.161
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics && git pull
podman restart site-duckshotanalytics
```

---

## 📝 Next Actions

1. ✅ Review `docs/PODMAN_DEPLOYMENT.md`
2. ⏭️ Add dev container to docker-compose.new.yml
3. ⏭️ Create dev directory on server
4. ⏭️ Deploy containers
5. ⏭️ Verify both URLs work with HTTPS
6. ⏭️ Add git remote for dev

---

## 💡 Pro Tip

You can manage ALL your sites from one place:
```bash
# See all sites
podman ps

# Restart a site
podman restart site-duckshotanalytics

# View logs
podman logs -f site-duckshotanalytics

# Update a site
cd /home/cira/Duckshotanalytics.com-DuckSnapAnalytics
git pull
podman restart site-duckshotanalytics
```

**Ready to add the dev environment?** Just follow Step 2 in `docs/PODMAN_DEPLOYMENT.md`!
