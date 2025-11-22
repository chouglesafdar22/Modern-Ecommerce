import express from "express";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/user", protect, (req: any, res) => {
    res.json({ message: `Welcome, ${req.user.name}` })
});

router.get("/admin", protect, admin, (req: any, res) => {
    res.json({ message: `Admin access granted for ${req.user.name}` })
});

export default router;