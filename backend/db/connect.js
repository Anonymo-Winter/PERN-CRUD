import dotenv from "dotenv";
dotenv.config();
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    host: process.env.HOSTNAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.DBPORT,
    database: process.env.DATABASE_NAME,
});

let isConnected = false; // Flag to track the connection status

pool.on("connect", () => {
    if (!isConnected) {
        console.log("Database Connected!");
        isConnected = true; // Set the flag to true after the first log
    }
});

pool.on("error", (err) => {
    console.log("Unexpected error ", err.message);
});

// Test the connection immediately after pool initialization
(async () => {
    try {
        const client = await pool.connect();
        console.log(
            "Database time:",
            (await pool.query("SELECT NOW()")).rows[0]
        );
        client.release();
    } catch (err) {
        console.error("Failed to connect to the database", err.message);
    }
})();

export default pool;
