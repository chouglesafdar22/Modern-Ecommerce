import multer from "multer";
import path from "path";

// Store file in memory (not disk)
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowed.includes(ext)) {
        return cb(new Error("Only JPG, PNG, WEBP allowed"));
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
