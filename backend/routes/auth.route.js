import express from "express";
import { login, signup, logout, checkAuth, googleAuth } from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/google", googleAuth);
router.post("/signup", signup);
router.post("/logout", logout);
router.get("/check-auth", verifyToken, checkAuth);

export default router;
