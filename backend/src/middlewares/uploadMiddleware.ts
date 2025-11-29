import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/products");
    },
    filename(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowed.includes(ext)) {
        return cb(new Error("Only JPG, PNG, WEBP allowed"));
    }
    cb(null, true);
};

export const upload = multer({ storage, fileFilter });
