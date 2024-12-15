import express from "express";
import dotenv from "dotenv";
import crudRouter from "./routes/crud.route.js";
import cors from "cors";
import pool from "./db/connect.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// routes
app.use("/api/auth", authRouter);
app.use("/api/crud", crudRouter);

// server
app.listen(port, () => {
    console.log("server running on port ", port);
});
