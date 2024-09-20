// clean_db.js

const { Client } = require('pg');

const RESTORE_DB_URL = "postgresql://postgres:xxxxxx@xxxx.proxy.rlwy.net:xxxx/railway";

async function cleanDatabase() {
    const client = new Client({
        connectionString: RESTORE_DB_URL,
    });

    try {
        await client.connect();
        console.log("Connected to the database.");

        const dropSchema = 'DROP SCHEMA public CASCADE;';
        const createSchema = 'CREATE SCHEMA public;';
        const sql = `${dropSchema} ${createSchema}`;

        await client.query(sql);
        console.log("Database cleaned successfully.");
    } catch (err) {
        console.error("Error cleaning the database:", err);
    } finally {
        await client.end();
    }
}

cleanDatabase();
