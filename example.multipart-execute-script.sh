#!/bin/bash

# Define environment variables
BACKUP_DB_URL="your_database_url"
RESTORE_DB_URL="your_database_url"

# Build the Docker image for multi-part backup
echo "Building the Docker image for multi-part backup..."
docker build -f Dockerfile.multipart.backup -t psql-backup-restore-multipart-backup .

# Run the Docker container for backup with the necessary environment variables
echo "Running the Docker container for backup..."
docker run -e BACKUP_DB_URL="$BACKUP_DB_URL" -v $(pwd)/src/multi-part:/app/src/multi-part -it psql-backup-restore-multipart-backup bash -c "
  echo 'Executing multi-part backup script...'
  node src/multi-part/multi-part-backup.js
"

# Extract the latest backup directory name
LATEST_BACKUP=$(ls -Art src/multi-part | grep backup_ | tail -n 1)
echo "Latest backup directory: $LATEST_BACKUP"

# Build the Docker image for multi-part restore
echo "Building the Docker image for multi-part restore..."
docker build -f Dockerfile.multipart.restore -t psql-backup-restore-multipart-restore .

# Run the Docker container for restore with the necessary environment variables
echo "Running the Docker container for restore..."
docker run -e RESTORE_DB_URL="$RESTORE_DB_URL" -v $(pwd)/src/multi-part:/app/src/multi-part -it psql-backup-restore-multipart-restore bash -c "
  echo 'Executing multi-part restore script...'
  node src/multi-part/multi-part-restore.js $LATEST_BACKUP
"