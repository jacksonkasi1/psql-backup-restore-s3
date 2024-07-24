#!/bin/bash

# Set environment variables
export BACKUP_DB_URL="your_backup_db_url"
export RESTORE_DB_URL="your_restore_db_url"

# Run backup
docker build -t psql-backup -f Dockerfile.backup .
docker run -e BACKUP_DB_URL="$BACKUP_DB_URL" -v $(pwd):/app -it psql-backup node backup.js

# Check for the latest backup file
LATEST_BACKUP_FILE=$(ls -t backup_*.tar 2>/dev/null | head -n 1)

# Verify that a backup file was created
if [ -z "$LATEST_BACKUP_FILE" ]; then
  echo "No backup file found. Backup may have failed."
  exit 1
fi

echo "Latest backup file: $LATEST_BACKUP_FILE"

# Run restore
docker build -t psql-restore -f Dockerfile.restore .
docker run -e RESTORE_DB_URL="$RESTORE_DB_URL" -v $(pwd):/app -it psql-restore node restore.js $LATEST_BACKUP_FILE