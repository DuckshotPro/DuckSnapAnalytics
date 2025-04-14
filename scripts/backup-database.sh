#!/bin/bash

# Get current date for backup file name
BACKUP_DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="database_backup_$BACKUP_DATE.sql"

# Check if required environment variables are set
if [ -z "$PGUSER" ] || [ -z "$PGHOST" ] || [ -z "$PGDATABASE" ]; then
  echo "Error: Required environment variables (PGUSER, PGHOST, PGDATABASE) are not set."
  exit 1
fi

echo "Creating backup of PostgreSQL database..."
echo "Database: $PGDATABASE"
echo "Host: $PGHOST"
echo "User: $PGUSER"
echo "Backup file: $BACKUP_FILE"

# Create backup using pg_dump
pg_dump -h $PGHOST -U $PGUSER -d $PGDATABASE > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Backup created successfully: $BACKUP_FILE"
  
  # Create a compressed version
  echo "Compressing backup file..."
  gzip -f "$BACKUP_FILE"
  
  echo "Backup completed: ${BACKUP_FILE}.gz"
  echo "You can download this file from the Replit interface."
else
  echo "Error: Backup failed."
  exit 1
fi