const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function restoreLocalBackup(dbUrl, backupFileName) {
  if (!backupFileName) {
    console.error("No backup file name provided");
    return;
  }

  const filePath = path.join(__dirname, backupFileName);

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
    { maxBuffer: 1024 * 1024 * 5000 }, // Set maxBuffer option to 5000 MB (adjust as needed)
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log("Database restored successfully!");
    }
  );
}

// Example usage
const dbUrl = process.env.RESTORE_DB_URL;
const backupFileName = process.argv[2]; // Get backup file name from command line arguments
restoreLocalBackup(dbUrl, backupFileName);

module.exports = restoreLocalBackup;
