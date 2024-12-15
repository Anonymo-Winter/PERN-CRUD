import express from "express";
import verifyToken from "../middlewares/verifyToken.middleware.js";
import upload from "../middlewares/multer.middleware.js";

import { fetchData, addData, deleteData, updateData } from "../controllers/crud.controller.js";

const router = express.Router();

router.post("/", verifyToken, fetchData);
router.post("/add-data", verifyToken, upload.single("file"), addData);
router.post("/delete-data", verifyToken, deleteData);
router.post("/update-data", verifyToken, upload.single("file"), updateData);

export default router;
