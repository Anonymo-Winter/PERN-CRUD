import pool from "../db/connect.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fetchData = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            throw new Error("Failed to fetch data");
        }
        const result = await pool.query(
            "SELECT notes.* FROM notes join users_notes on users_notes.user_email=$1 and notes.id=users_notes.notes_id",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No data found" });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.log("Error occured while fetching data", error);
        res.status(500).json({ message: error.message });
    }
};

export const addData = async (req, res) => {
    const { title, description, email } = req.body;
    const file = req.file;
    try {
        if (!title || !description || !file) {
            throw new Error("All fields are required");
        }
        const file_url = await uploadOnCloudinary(file.path);
        const checkEmail = await pool.query("SELECT 1 FROM users WHERE email=$1", [email]);

        if (checkEmail.rowCount === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const result = await pool.query(
            "INSERT INTO notes (title,description,imageLink,imgName) VALUES($1,$2,$3,$4) RETURNING id",
            [title, description, file_url.secure_url, file_url.original_filename + "." + file_url.format]
        );

        const result1 = await pool.query("INSERT INTO users_notes(user_email,notes_id) VALUES($1,$2);", [
            email,
            result.rows[0].id,
        ]);
        res.status(200).json({ message: "Data added successfully" });
    } catch (error) {
        console.log("Error occured while adding data : ", error.message);
        res.status(500).json({ message: "something went wrong. try again!" });
    }
};

export const updateData = async (req, res) => {
    const { id, title, description } = req.body;
    const file = req.file;
    try {
        if (!id || !title || !description || !file) {
            throw new Error("All fields are required");
        }

        const existing_img = await pool.query("SELECT imgName FROM notes where id=$1", [id]);
        const local_filename = `backend/public/images/${existing_img.rows[0].imgname}`;

        if (fs.existsSync(local_filename)) {
            fs.unlinkSync(local_filename);
            console.log("file deleted from local folder : " + local_filename);
        } else {
            console.warn("file not found in local folder : " + local_filename);
        }
        const file_url = await uploadOnCloudinary(file.path);

        const result = await pool.query(
            "UPDATE notes SET title=$1,description=$2,imagelink=$3,imgName=$4 WHERE id=$5",
            [title, description, file_url.secure_url, file_url.original_filename + "." + file_url.format, id]
        );
        res.status(200).json({ message: "Data updated successfully" });
    } catch (error) {
        const local_filename = path.join(__dirname, `../public/images/${result.rows[0].imgname}`);
        if (fs.existsSync(local_filename)) {
            fs.unlinkSync(local_filename);
        }
        console.log("Error occured while updating data", error);
        res.status(500).json({ message: "Something went wrong. try again" });
    }
};

export const deleteData = async (req, res) => {
    const { id } = req.body;
    try {
        const result = await pool.query("DELETE FROM notes WHERE id=$1 RETURNING *", [id]);
        const local_filename = path.join(__dirname, `../public/images/${result.rows[0].imgname}`);
        if (fs.existsSync(local_filename)) {
            fs.unlinkSync(local_filename);
            console.log("local file successfully deleted! : " + result.rows[0].imgname);
        }
        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        console.log("Error occured while updating data", error.message);
        res.status(500).json({ message: "Something went wrong. try again!" });
    }
};
