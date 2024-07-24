const { exec } = require("child_process");
const path = require("path");

function backupDatabase(dbUrl) {
  const timestamp = Date.now();
  const backupFileName = `backup_${timestamp}.tar`;
  const filePath = path.join(__dirname, backupFileName);

  const command = `pg_dump -F t -d ${dbUrl} -f ${filePath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`Backup created successfully at ${filePath}`);
    console.log(`stdout: ${stdout}`);
  });
}

// Example usage
const dbUrl = process.env.BACKUP_DB_URL;
backupDatabase(dbUrl);

module.exports = backupDatabase;
