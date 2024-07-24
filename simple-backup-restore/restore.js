const { exec } = require("child_process");
const path = require("path");

function restoreDatabase(dbUrl, backupFileName) {
  if (!backupFileName) {
    console.error("No backup file name provided");
    return;
  }

  const filePath = path.join(__dirname, backupFileName);

  const command = `pg_restore -U postgres -d ${dbUrl} ${filePath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log("Database restored successfully!");
    console.log(`stdout: ${stdout}`);
  });
}

// Example usage
const dbUrl = process.env.RESTORE_DB_URL;
const backupFileName = process.argv[2]; // Get backup file name from command line arguments

restoreDatabase(dbUrl, backupFileName);

module.exports = restoreDatabase;
