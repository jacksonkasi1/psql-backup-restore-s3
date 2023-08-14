require("dotenv").config();

const app = require("./src/app");
const startBackupCronJob = require("./src/auto-backup"); // Import the backup cron job

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

startBackupCronJob(); // Start the backup cron job
