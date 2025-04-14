#!/bin/bash

# Check if a backup file is provided
if [ -z "$1" ]; then
  echo "Error: No backup file specified."
  echo "Usage: $0 <backup_file>"
  exit 1
fi

BACKUP_FILE="$1"

# Check if the backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file '$BACKUP_FILE' not found."
  exit 1
fi

# Check if required environment variables are set
if [ -z "$PGUSER" ] || [ -z "$PGHOST" ] || [ -z "$PGDATABASE" ]; then
  echo "Error: Required environment variables (PGUSER, PGHOST, PGDATABASE) are not set."
  exit 1
fi

echo "Restoring PostgreSQL database from backup..."
echo "Database: $PGDATABASE"
echo "Host: $PGHOST"
echo "User: $PGUSER"
echo "Backup file: $BACKUP_FILE"

# Check if the file is compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
  echo "Decompressing backup file..."
  gunzip -c "$BACKUP_FILE" | psql -h $PGHOST -U $PGUSER -d $PGDATABASE
  RESTORE_RESULT=$?
else
  # Restore the database using psql
  psql -h $PGHOST -U $PGUSER -d $PGDATABASE < "$BACKUP_FILE"
  RESTORE_RESULT=$?
fi

if [ $RESTORE_RESULT -eq 0 ]; then
  echo "Database restored successfully from $BACKUP_FILE"
else
  echo "Error: Database restoration failed."
  exit 1
fi