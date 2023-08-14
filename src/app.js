const fs = require("fs");
const path = require("path");
const url = require("url");

const { exec } = require("child_process");
const AWS = require("aws-sdk");
const express = require("express");

const app = express();
app.use(express.json());

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

app.get("/api/backup", async (req, res) => {
  try {
    const { bucket, folder, dbUrl } = req.query;

    console.log("Aws config updated");

    const fileName = `backup_${Date.now()}.sql`;
    const filePath = path.join(__dirname, fileName);

    console.log("Backup Process started...");

    const command = `pg_dump ${dbUrl} > ${filePath}`;
    exec(
      command,
      { maxBuffer: 1024 * 1024 * 5000 }, // Set maxBuffer option to 5000 MB (adjust as needed)
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).send(`exec error: ${error}`);
        }

        const data = await fs.promises.readFile(filePath);

        let fileLocation = folder ? `${folder}/${fileName}` : fileName;

        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileLocation,
          Body: data,
          ContentType: "application/octet-stream",
          ContentDisposition: `DB Backup file ${fileLocation} and time = ${Date.now()}`,
        };

        const uploadResult = await s3.upload(params).promise();

        console.log(`Backup uploaded successfully to ${bucket}/${fileName}`);
        fs.unlinkSync(filePath);
        console.log("File deleted");

        const location = uploadResult.Location; // Get the S3 object location

        res.status(200).json({
          success: true,
          message: `Backup uploaded successfully to ${location}`, // Include the S3 object location in the message
          location: location, // Include the location in the response
        });
      }
    );
  } catch (err) {
    console.error(`Error: ${err}`);
    const fileName = `backup_${Date.now()}.sql`;
    fs.unlinkSync("backup.sql");
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
});

app.get("/api/restore", async (req, res) => {
  const { dbUrl, key } = req.query;

  const fileName = `backup.sql`;
  const filePath = path.join(__dirname, fileName);

  const params = {
    Bucket: process.env.S3_BUCKET_NAME, // Replace with your S3 bucket name
    Key: key,
  };

  try {
    const response = await s3.getObject(params).promise();
    if (response.Body) {
      fs.writeFileSync(filePath, response.Body);
      console.log("Database backup file downloaded successfully!");
    } else {
      console.log("Empty response body received.");
    }

    // Parsing the dbUrl
    const parsedUrl = new URL(dbUrl);
    const username = parsedUrl.username;
    const password = parsedUrl.password;
    const host = parsedUrl.hostname;
    const port = parsedUrl.port;
    const database = parsedUrl.pathname.replace(/^\//, "");

    // Restoring the database
    console.log("Database restoring...");

    const command = `PGPASSWORD=${password} psql -U ${username} -h ${host} -p ${port} ${database} --single-transaction < ${filePath}`;

    exec(
      command,
      { maxBuffer: 1024 * 1024 * 5000 }, // Set maxBuffer option to 5000 MB (adjust as needed)
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).send(`Error restoring database: ${error}`);
        }
        console.log("Database restored!");
        fs.unlinkSync(filePath);
        res.send("Database restored successfully!");
      }
    );
  } catch (err) {
    const fileName = `backup.sql`;
    const filePath = path.join(__dirname, fileName);
    fs.unlinkSync(filePath);
    console.error(`s3 download error: ${err}`);
    res.status(500).send(`Error downloading from S3: ${err}`);
  }
});

module.exports = app;
