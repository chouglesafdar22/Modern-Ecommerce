import express from "express";
import {
    signup,
    login,
    forgotPassword,
    resetPassword
} from "../controllers/userController";
import { protect, admin } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected user route
router.get("/me", protect, (req, res) => {
    res.json({ user: (req as any).user });
});

// Admin-only route
router.get("/admin", protect, admin, (req, res) => {
    res.json({ message: "Admin access granted" });
});

export default router;