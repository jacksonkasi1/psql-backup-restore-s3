# PostgreSQL Backup and Restore with Multi-part Support

This repository provides a solution for backing up and restoring PostgreSQL databases, including support for large databases with multi-part backups and the TimescaleDB extension.

## Multi-part Backup and Restore

To handle large databases efficiently, this solution uses the directory format with parallel processing for backups and restores. This ensures that large databases can be managed effectively without running into file size limitations or performance issues.

### Features

- **Multi-part Backup**: Uses PostgreSQL's directory format and parallel processing to create backups.
- **Multi-part Restore**: Restores multi-part backups with support for TimescaleDB extensions.
- **Dockerized**: The process is containerized to ensure consistency and portability.

### Files

- `src/multi-part/multi-part-backup.js`: Script for performing multi-part backups.
- `src/multi-part/multi-part-restore.js`: Script for restoring multi-part backups.
- `Dockerfile.multipart.backup`: Dockerfile for the multi-part backup process.
- `Dockerfile.multipart.restore`: Dockerfile for the multi-part restore process.
- `example.multipart-execute-script.sh`: Example script to execute the multi-part backup and restore processes.

### Requirements

- Docker
- PostgreSQL with TimescaleDB extension installed (on the target server for restore)

### Usage

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jacksonkasi1/psql-backup-restore-s3.git
   cd psql-backup-restore-s3
   ```

2. **Set Up Environment Variables**

   Update the `example.multipart-execute-script.sh` with your PostgreSQL database URLs for backup and restore:

   ```bash
   BACKUP_DB_URL="your_database_url"
   RESTORE_DB_URL="your_database_url"
   ```

3. **Make the Script Executable**

   ```bash
   chmod +x example.multipart-execute-script.sh
   ```

4. **Run the Script**

   ```bash
   sudo ./example.multipart-execute-script.sh
   ```

### Explanation of the Process

1. **Building Docker Images**:
   - The script builds Docker images for the multi-part backup and restore processes using the respective Dockerfiles.

2. **Running Backup**:
   - The backup script (`multi-part-backup.js`) is executed within a Docker container, creating a multi-part backup in a directory format.

3. **Identifying Latest Backup**:
   - The script identifies the latest backup directory created during the backup process.

4. **Running Restore**:
   - The restore script (`multi-part-restore.js`) is executed within a Docker container, restoring the database from the multi-part backup with support for TimescaleDB extensions.

### Troubleshooting

- Ensure that the TimescaleDB extension is installed on the target PostgreSQL server where the database is being restored.
- Verify that the backup directory contains the necessary backup files.

### Contributing

Feel free to open issues or submit pull requests for improvements and bug fixes.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
