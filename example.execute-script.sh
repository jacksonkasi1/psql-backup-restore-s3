#!/bin/bash

# Define environment variables
BACKUP_DB_URL="your_database_url"
RESTORE_DB_URL="your_database_url"

# Build the Docker image for backup
echo "Building the Docker image for backup..."
docker build -f Dockerfile.backup -t psql-backup-restore-backup .

# Run the Docker container for backup with the necessary environment variables
echo "Running the Docker container for backup..."
docker run -e BACKUP_DB_URL="$BACKUP_DB_URL" -v $(pwd)/src/local:/app/src/local -it psql-backup-restore-backup bash -c "
  echo 'Executing backup script...'
  node src/local/local-backup.js
"

# Extract the latest backup file name
LATEST_BACKUP=$(ls -Art src/local | grep backup_ | tail -n 1)
echo "Latest backup file: $LATEST_BACKUP"

# Build the Docker image for restore
echo "Building the Docker image for restore..."
docker build -f Dockerfile.restore -t psql-backup-restore-restore .

# Run the Docker container for restore with the necessary environment variables
echo "Running the Docker container for restore..."
docker run -e RESTORE_DB_URL="$RESTORE_DB_URL" -v $(pwd)/src/local:/app/src/local -it psql-backup-restore-restore bash -c "
  echo 'Executing restore script...'
  node src/local/local-restore.js $LATEST_BACKUP
"