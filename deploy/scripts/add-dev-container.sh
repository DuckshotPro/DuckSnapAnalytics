#!/bin/bash
# Script to add dev container to docker-compose.new.yml

COMPOSE_FILE="/home/cira/docker-compose.new.yml"

# The dev container configuration to add
DEV_CONTAINER='
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
      # Reverse Proxy Configuration (nginx-proxy + Let'\''s Encrypt)
      - VIRTUAL_HOST=dev.duckshotanalytics.com
      - VIRTUAL_PORT=5000
      - LETSENCRYPT_HOST=dev.duckshotanalytics.com
      - LETSENCRYPT_EMAIL=${ADMIN_EMAIL}
      
      # Database and Services (separate dev database)
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@dp1-db01:5432/duckshot_dev
      - REDIS_URL=redis://:${REDIS_PASSWORD}@dp1-redis01:6379/1
      
      # Application Configuration
      - NODE_ENV=development
      - PORT=5000
      - APP_URL=https://dev.duckshotanalytics.com
      
      # PayPal (Sandbox for dev)
      - PAYPAL_MODE=sandbox
      - PAYPAL_CLIENT_ID=${PAYPAL_SANDBOX_CLIENT_ID:-}
      - PAYPAL_CLIENT_SECRET=${PAYPAL_SANDBOX_CLIENT_SECRET:-}
      
      # Snapchat OAuth
      - SNAPCHAT_CLIENT_ID=${SNAPCHAT_CLIENT_ID:-}
      - SNAPCHAT_CLIENT_SECRET=${SNAPCHAT_CLIENT_SECRET:-}
      
      # Session
      - SESSION_SECRET=${DEV_SESSION_SECRET:-dev_session_secret_change_me}
'

echo "Adding dev container to docker-compose.new.yml..."

# Find the line number after the ducksnap-worker section
LINE_NUM=$(grep -n "^  ducksnap-worker:" "$COMPOSE_FILE" | cut -d: -f1)

if [ -z "$LINE_NUM" ]; then
    echo "Error: Could not find ducksnap-worker section"
    exit 1
fi

# Find the end of the ducksnap-worker section (next section or end of file)
END_LINE=$(tail -n +$((LINE_NUM + 1)) "$COMPOSE_FILE" | grep -n "^  [a-z]" | head -1 | cut -d: -f1)

if [ -z "$END_LINE" ]; then
    # It's at the end of the file
    echo "$DEV_CONTAINER" >> "$COMPOSE_FILE"
    echo "✓ Dev container added at end of file"
else
    # Insert before the next section
    INSERT_LINE=$((LINE_NUM + END_LINE - 1))
    
    # Create temp file with the insertion
    head -n "$INSERT_LINE" "$COMPOSE_FILE" > /tmp/compose_temp.yml
    echo "$DEV_CONTAINER" >> /tmp/compose_temp.yml
    tail -n +$((INSERT_LINE + 1)) "$COMPOSE_FILE" >> /tmp/compose_temp.yml
    
    # Replace original file
    mv /tmp/compose_temp.yml "$COMPOSE_FILE"
    echo "✓ Dev container added at line $INSERT_LINE"
fi

echo ""
echo "✅ Done! Dev container configuration added."
echo ""
echo "Next steps:"
echo "  1. Create dev directory: cd /home/cira && git clone https://github.com/DuckshotPro/DuckSnapAnalytics.git dev-DuckSnapAnalytics"
echo "  2. Deploy: podman-compose -f docker-compose.new.yml up -d --build site-duckshotanalytics-dev"
