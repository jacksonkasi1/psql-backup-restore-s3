# PostgreSQL Backup and Restore

This repository provides a simple solution for backing up and restoring PostgreSQL databases using `pg_dump` and `pg_restore`.

## Features

- **Simple Backup**: Uses PostgreSQL's tar format for creating backups.
- **Simple Restore**: Restores backups created in tar format.
- **Dockerized**: The process is containerized to ensure consistency and portability.

### Files

- `backup.js`: Script for performing database backups.
- `restore.js`: Script for restoring database backups.
- `Dockerfile.backup`: Dockerfile for the backup process using PostgreSQL 15.
- `Dockerfile.restore`: Dockerfile for the restore process using PostgreSQL 16.
- `execute-script.sh`: Script to execute the backup and restore processes.

### Requirements

- Docker
- PostgreSQL installed on the target server for restore

### Usage

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jacksonkasi1/psql-backup-restore-s3.git
   cd psql-backup-restore-s3/simple-backup-restore
   ```

2. **Set Up Environment Variables**

   Update the `execute-script.sh` with your PostgreSQL database URLs:

   ```bash
   export BACKUP_DB_URL="your_backup_db_url"
   export RESTORE_DB_URL="your_restore_db_url"
   ```

3. **Make the Script Executable**

   ```bash
   chmod +x execute-script.sh
   ```

4. **Run the Script**

   ```bash
   sudo ./execute-script.sh
   ```

### Explanation of the Process

1. **Building Docker Images**:
   - The script builds Docker images for the backup and restore processes using the respective Dockerfiles.

2. **Running Backup**:
   - The backup script (`backup.js`) is executed within a Docker container, creating a backup file in tar format.

3. **Running Restore**:
   - The restore script (`restore.js`) is executed within a Docker container, restoring the database from the tar backup file.

### Troubleshooting

- Ensure that the backup file exists in the expected directory.
- Verify that the PostgreSQL server is accessible and the credentials are correct.

### Contributing

Feel free to open issues or submit pull requests for improvements and bug fixes.

### License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.