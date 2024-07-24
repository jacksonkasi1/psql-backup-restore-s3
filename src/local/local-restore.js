const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function restoreLocalBackup(dbUrl, backupFileName) {
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
const backupFileName = 'backup_<TIMESTAMP>.sql'; // Replace <TIMESTAMP> with the actual timestamp
restoreLocalBackup(dbUrl, backupFileName);

module.exports = restoreLocalBackup;
