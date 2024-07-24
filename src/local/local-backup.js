const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function performLocalBackup(dbUrl) {
  const fileName = `backup_${Date.now()}.sql`;
  const filePath = path.join(__dirname, fileName);

  console.log("Local Backup Process started...");

  const command = `pg_dump ${dbUrl} > ${filePath}`;

  exec(
    command,
    { maxBuffer: 1024 * 1024 * 5000 }, // Set maxBuffer option to 5000 MB (adjust as needed)
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }

      console.log(`Backup created successfully at ${filePath}`);
    }
  );
}

// Example usage
const dbUrl = process.env.BACKUP_DB_URL;
performLocalBackup(dbUrl);

module.exports = performLocalBackup;
