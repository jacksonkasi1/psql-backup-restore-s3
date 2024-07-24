# Database Backup and Restore

This application is built on Node.js, using Express for the server and AWS S3 to handle database backups.



## Features

- Backup your database to an SQL file and upload it to Amazon S3.
- Restore your database from a backup stored on Amazon S3.
- Auto backup your database from a backup stored on Amazon S3 Everyday at 5 AM.


## Setup

Clone the repository:

```sh
git clone https://github.com/jacksonkasi1/psql-backup-restore-s3
```

Before you start, you need to set the following environment variables in your `.env` file:

- `AWS_ACCESSKEY`: Your AWS access key ID.
- `AWS_SECRETKEY`: Your AWS secret access key.
- `S3_BUCKET_NAME`: The name of your AWS S3 bucket for the backups.
- `REGION`: The AWS region where your S3 bucket is located.
- `BACKUP_DB_URL`: The Postgres database URL for the backup.

## Running the application

First, install the required packages with:

```sh
npm install
```

You can then start the server with:

```sh
node server.js
```

## API Endpoints

The application serves the following endpoints:

### Backup

- `GET /api/backup`: Backs up the database to the AWS S3 bucket.

Example:

```sh
{{bash_url}}/api/backup?dbUrl=xxx&folder=xxx
```

- `folder`: (optional): The folder within the bucket to store the backup.
- `dbUrl`: The URL of the database to backup.

### Restore

- `GET /api/restore`: Restores the database from a specified backup file in the AWS S3 bucket.

Example:

```sh
{{bash_url}}/api/restore?dbUrl=xxx&key=xxx
```

- `dbUrl`: The URL of the database to restore to.
- `key`: `My-Folder/backup_1692022317936.sql` The Amazon S3 object key of the backup to restore.

## Automatic backup

The server will automatically backup the database every day at 5 AM using a cron job.

## Notes

- This application assumes you have PostgreSQL (pg_dump) installed and configured on your system.
- Restore api commend does not execute on windows system. We recommend that you utilise the Linux operating system.
- It's recommended to set up proper security measures for handling AWS credentials and environment variables.

