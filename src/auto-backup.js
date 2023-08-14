const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const AWS = require("aws-sdk");
const cron = require("node-cron");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

function performBackup() {
  const { BACKUP_DB_URL } = process.env;

  const fileName = `backup_${Date.now()}.sql`;
  const filePath = path.join(__dirname, fileName);

  console.log("Backup Process started...");

  const command = `pg_dump ${BACKUP_DB_URL} > ${filePath}`;

  exec(
    command,
    { maxBuffer: 1024 * 1024 * 5000 }, // Set maxBuffer option to 5000 MB (adjust as needed)
    async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }

      const data = await fs.promises.readFile(filePath);

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: data,
        ContentType: "application/octet-stream",
        ContentDisposition: `DB Backup file ${fileName} and time = ${Date.now()}`,
      };

      await s3.upload(params).promise();

      console.log(`Backup uploaded successfully to S3: ${fileName}`);
      fs.unlinkSync(filePath);
      console.log("File deleted");
    }
  );
}

function startBackupCronJob(server) {
  cron.schedule("0 5 * * *", () => {
    console.log("Starting backup cron job...");
    performBackup();
  });

  console.log("Backup cron job scheduled to run every day at 5 AM.");
}

module.exports = startBackupCronJob;
