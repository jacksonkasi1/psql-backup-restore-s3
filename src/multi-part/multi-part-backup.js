const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function performMultipartBackup(dbUrl) {
  const dirName = `backup_${Date.now()}`;
  const dirPath = path.join(__dirname, dirName);

  console.log("Multi-part Backup Process started...");

  const command = `pg_dump -F d -j 4 ${dbUrl} -f ${dirPath}`;

  exec(
    command,
    { maxBuffer: 1024 * 1024 * 10240 }, // Set maxBuffer option to 10 GB
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.error(`stderr: ${stderr}`);
        return;
      }

      console.log(`Backup created successfully at ${dirPath}`);
    }
  );
}

// Example usage
const dbUrl = process.env.BACKUP_DB_URL;
performMultipartBackup(dbUrl);

module.exports = performMultipartBackup;
