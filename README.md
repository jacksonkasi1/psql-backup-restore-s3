# PostgreSQL Backup and Restore using Docker

This project provides scripts and Docker configurations to perform PostgreSQL database backups and restores using Docker containers. The backup script creates a local SQL file, while the restore script restores the database from the local backup file.

## Prerequisites

- Docker must be installed on your system.
- Node.js must be installed on your system.
- PostgreSQL database URLs for backup and restore.

## Project Structure

```
psql-backup-restore-s3/
│
├── src/
│   └── local/
│       ├── local-backup.js
│       ├── local-restore.js
│
├── Dockerfile.backup
├── Dockerfile.restore
├── example.execute-script.sh
├── package.json
├── package-lock.json
└── README.md
```

## Setup

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/your-username/psql-backup-restore-s3.git
    cd psql-backup-restore-s3
    ```

2. **Install Node.js Dependencies:**

    ```bash
    npm install
    ```

## Usage

### Step 1: Prepare Environment Variables

Create a `.env` file in the root of your project with the following content:

```
BACKUP_DB_URL=your_backup_database_url
RESTORE_DB_URL=your_restore_database_url
```

Replace `your_backup_database_url` and `your_restore_database_url` with your actual PostgreSQL database URLs.

### Step 2: Customize `example.execute-script.sh`

Copy the `example.execute-script.sh` to `execute-script.sh` and make sure your `.env` file is correctly referenced:

```bash
cp example.execute-script.sh execute-script.sh
```

### Step 3: Make the Script Executable

Make the `execute-script.sh` script executable:

```bash
chmod +x execute-script.sh
```

### Step 4: Run the Script

Execute the script to perform the backup and restore operations:

```bash
./execute-script.sh
```

### Step 5: Verify Backup and Restore

- The backup SQL file will be created in the `src/local` directory.
- The database will be restored from the latest backup file found in the `src/local` directory.

## Docker Images

- `Dockerfile.backup` - Dockerfile for creating backups.
- `Dockerfile.restore` - Dockerfile for restoring from backups.

## Scripts

### `local-backup.js`

This script performs a backup of the PostgreSQL database to a local SQL file.

### `local-restore.js`

This script restores the PostgreSQL database from a local SQL file.

## Notes

- Ensure that your `.env` file is not pushed to your version control system as it contains sensitive information.
- This project assumes that the backup and restore processes are handled by different PostgreSQL versions. Modify the Dockerfiles as necessary to match your specific setup.

## License

This project is licensed under the MIT License.