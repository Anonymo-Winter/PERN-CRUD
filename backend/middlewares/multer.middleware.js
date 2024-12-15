import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "backend/public/images");
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, bytes) {
            const filename = bytes.toString("hex") + path.extname(file.originalname);
            cb(null, filename);
        });
    },
});

const upload = multer({ storage: storage });

export default upload;
