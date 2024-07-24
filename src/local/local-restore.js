const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function restoreLocalBackup(dbUrl, backupFileName) {
  if (!backupFileName) {
    console.error("No backup file name provided");
    return;
  }

  const filePath = path.join(__dirname, backupFileName);

  // Verify the backup file exists and log its size
  if (!fs.existsSync(filePath)) {
    console.error(`Backup file ${filePath} does not exist`);
    return;
  }

  const fileSize = fs.statSync(filePath).size;
  console.log(`Restoring from backup file: ${filePath} (${(fileSize / (1024 * 1024)).toFixed(2)} MB)`);

  // Parsing the dbUrl
  const parsedUrl = new URL(dbUrl);
  const username = parsedUrl.username;
  const password = parsedUrl.password;
  const host = parsedUrl.hostname;
  const port = parsedUrl.port;
  const database = parsedUrl.pathname.replace(/^\//, "");

  console.log("Database restoring...");

  const command = `PGPASSWORD=${password} psql -U ${username} -h ${host} -p ${port} ${database} --single-transaction < ${filePath}`;

  exec(
    command,
    { maxBuffer: 1024 * 1024 * 10240, timeout: 0 }, // Set maxBuffer option to 10 GB and disable timeout
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log("Database restored successfully!");
      console.log(`stdout: ${stdout}`);
    }
  );
}

// Example usage
const dbUrl = process.env.RESTORE_DB_URL;
const backupFileName = process.argv[2]; // Get backup file name from command line arguments
restoreLocalBackup(dbUrl, backupFileName);

module.exports = restoreLocalBackup;
