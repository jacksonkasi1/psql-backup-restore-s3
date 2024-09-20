#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# ---------------------------
# Configuration
# ---------------------------

# RESTORE_DB_URL: PostgreSQL connection URL for the database to be cleaned
RESTORE_DB_URL="postgresql://postgres:xxxxxx@xxxx.proxy.rlwy.net:xxxx/railway"

# ---------------------------
# Function Definitions
# ---------------------------

# Function to parse the PostgreSQL connection URL
parse_url() {
    local url=$1
    local regex='postgresql://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+)'
    
    if [[ $url =~ $regex ]]; then
        DB_USER=${BASH_REMATCH[1]}
        DB_PASSWORD=${BASH_REMATCH[2]}
        DB_HOST=${BASH_REMATCH[3]}
        DB_PORT=${BASH_REMATCH[4]}
        DB_NAME=${BASH_REMATCH[5]}
    else
        echo "Error: Invalid PostgreSQL URL format."
        exit 1
    fi
}

# Function to clean the database by dropping and recreating the public schema
clean_database() {
    echo "Cleaning the database: $DB_NAME"

    # SQL command to drop and recreate the public schema
    SQL_COMMAND="DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

    # Execute the SQL command using Docker and the official PostgreSQL image
    docker run --rm \
        -e PGPASSWORD="$DB_PASSWORD" \
        postgres:latest \
        psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -c "$SQL_COMMAND"

    echo "Database cleaned successfully."
}

# ---------------------------
# Main Script Execution
# ---------------------------

# Parse the RESTORE_DB_URL to extract connection details
parse_url "$RESTORE_DB_URL"

# Confirm the details (optional: remove in production)
echo "Connecting to PostgreSQL Database:"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"

# Prompt for confirmation before proceeding
read -p "Are you sure you want to clean the database '$DB_NAME'? This action cannot be undone. (y/N): " CONFIRM
CONFIRM=${CONFIRM,,}  # Convert to lowercase

if [[ "$CONFIRM" != "y" && "$CONFIRM" != "yes" ]]; then
    echo "Operation cancelled by the user."
    exit 0
fi

# Clean the database
clean_database
