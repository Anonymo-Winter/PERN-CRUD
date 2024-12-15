import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
const { Pool, Client } = pg;

console.log(process.env.HOSTNAME);

const initializeDatabase = async () => {
    const client = new Client({
        host: process.env.HOSTNAME,
        user: process.env.USER,
        password: process.env.PASSWORD,
        port: process.env.DBPORT,
    });

    try {
        await client.connect();
        console.log("Connected to PostgreSQL for database initialization");

        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [process.env.DATABASE_NAME]);

        if (res.rowCount === 0) {
            console.log(`Database '${process.env.DATABASE_NAME}' not found. Creating it...`);
            await client.query(`CREATE DATABASE "${process.env.DATABASE_NAME}"`);
            console.log(`Database '${process.env.DATABASE_NAME}' created successfully`);
        } else {
            console.log(`Database '${process.env.DATABASE_NAME}' already exists`);
        }

        // Connect to the created database for table initialization
        const dbClient = new Client({
            host: process.env.HOSTNAME,
            user: process.env.USER,
            password: process.env.PASSWORD,
            port: process.env.DBPORT,
            database: process.env.DATABASE_NAME,
        });

        await dbClient.connect();

        // Create Tables
        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                imageLink TEXT,
                imgName TEXT
            );
        `);

        console.log("Table 'notes' created successfully");

        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS users (
                email VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                password TEXT NOT NULL
            );
        `);
        console.log("Table 'users' created successfully");

        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS users_notes (
                user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
                notes_id INT REFERENCES notes(id) ON DELETE CASCADE,
                PRIMARY KEY (user_email, notes_id)
            );
        `);
        console.log("Table 'users_notes' created successfully");

        await dbClient.end();
    } catch (err) {
        console.error("Error initializing database:", err.message);
        throw err;
    } finally {
        await client.end();
        console.log("Admin client disconnected");
    }
};

const createPool = () => {
    const pool = new Pool({
        host: process.env.HOSTNAME,
        user: process.env.USER,
        password: process.env.PASSWORD,
        port: process.env.DBPORT,
        database: process.env.DATABASE_NAME,
    });

    pool.on("connect", () => {
        console.log("Database connected!");
    });

    pool.on("error", (err) => {
        console.error("Unexpected error on idle client", err.message);
    });

    return pool;
};

// Initialize database and create connection pool
(async () => {
    try {
        await initializeDatabase();
    } catch (err) {
        console.error("Initialization failed:", err.message);
    }
})();

const pool = createPool();

export default pool;
