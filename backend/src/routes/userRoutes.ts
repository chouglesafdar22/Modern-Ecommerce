import express from "express";
import {
    signup,
    login,
    forgotPassword,
    resetPassword
} from "../controllers/userController";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected user route
router.get("/me", authMiddleware, (req, res) => {
    res.json({ user: (req as any).user });
});

// Admin-only route
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: "Admin access granted" });
});

export default router;