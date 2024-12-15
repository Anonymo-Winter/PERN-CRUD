import bcryptjs from "bcryptjs";
import genTokenAndCookie from "../utils/genTokenAndCookie.js";
import pool from "../db/connect.js";
import oAuth2Client from "../utils/googleConfig.js";
import axios from "axios";

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required!");
        }
        const userAlreadyExists = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (userAlreadyExists.rowCount > 0) {
            return res.status(400).json({ success: false, message: "User Already Exists" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const response = await pool.query("INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *", [
            name,
            email,
            hashedPassword,
        ]);

        response.rows[0].password = undefined;

        genTokenAndCookie(res, email);
        res.status(201).json({
            success: true,
            user: response.rows[0],
            message: "User Created Successfully!",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new Error("All fields are required!");
        }
        const userExists = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (userExists.rowCount == 0) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const isPassword = await bcryptjs.compare(password, userExists.rows[0].password);

        if (!isPassword) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        genTokenAndCookie(res, email);

        userExists.rows[0].password = undefined;

        res.status(201).json({
            success: true,
            message: "Logged in successfully!",
            user: userExists.rows[0],
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully!",
    });
};

export const checkAuth = async (req, res) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE email=$1", [req.userId]);
        if (user.rowCount == 0) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        user.rows[0].password = undefined;
        res.status(200).json({ success: true, user: user.rows[0] });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { code } = req.query;
        const googleRes = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        const { email, name, picture } = userRes.data;
        const userAlreadyExists = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        genTokenAndCookie(res, email);
        if (userAlreadyExists.rowCount == 0) {
            const hashedPassword = await bcryptjs.hash(email, 10);
            const response = await pool.query("INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *", [
                name,
                email,
                hashedPassword,
            ]);
            response.rows[0].password = undefined;
            return res.status(201).json({
                success: true,
                user: response.rows[0],
                message: "User Created Successfully!",
            });
        }

        userAlreadyExists.rows[0].password = undefined;

        res.status(201).json({
            success: true,
            message: "Logged in successfully!",
            user: userAlreadyExists.rows[0],
        });
    } catch (error) {
        console.log(error);
    }
};
