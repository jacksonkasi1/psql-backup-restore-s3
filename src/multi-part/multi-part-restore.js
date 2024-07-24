const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function restoreMultipartBackup(dbUrl, backupDirName) {
  if (!backupDirName) {
    console.error("No backup directory name provided");
    return;
  }

  const dirPath = path.join(__dirname, backupDirName);

  // Verify the backup directory exists
  if (!fs.existsSync(dirPath)) {
    console.error(`Backup directory ${dirPath} does not exist`);
    return;
  }

  console.log(`Restoring from backup directory: ${dirPath}`);

  // Parsing the dbUrl
  const parsedUrl = new URL(dbUrl);
  const username = parsedUrl.username;
  const password = parsedUrl.password;
  const host = parsedUrl.hostname;
  const port = parsedUrl.port;
  const database = parsedUrl.pathname.replace(/^\//, "");

  console.log("Database restoring...");

  const restoreCommand = `PGPASSWORD=${password} pg_restore -U ${username} -h ${host} -p ${port} -d ${database} -j 4 ${dirPath}`;

  exec(
    restoreCommand,
    { maxBuffer: 1024 * 1024 * 10240, timeout: 0 }, // Set maxBuffer option to 10 GB and disable timeout
    (restoreError, restoreStdout, restoreStderr) => {
      if (restoreError) {
        console.error(`Restore exec error: ${restoreError}`);
        console.error(`Restore stderr: ${restoreStderr}`);
        return;
      }
      console.log("Database restored successfully!");
      console.log(`stdout: ${restoreStdout}`);
    }
  );
}

// Example usage
const dbUrl = process.env.RESTORE_DB_URL;
const backupDirName = process.argv[2]; // Get backup directory name from command line arguments
restoreMultipartBackup(dbUrl, backupDirName);

module.exports = restoreMultipartBackup;
