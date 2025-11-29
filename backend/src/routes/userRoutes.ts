import express from "express";
import {
    signup,
    login,
    forgotPassword,
    resetPassword,
    getAllUsers,
    logout
} from "../controllers/userController";
import { protect, admin } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/", protect, admin, getAllUsers);
router.post("/logout",protect,logout);

// Protected user route
router.get("/me", protect, (req, res) => {
    const user = (req as any).user;
    res.json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
        }
    });
});

// Admin-only route
router.get("/admin", protect, admin, (req, res) => {
    res.json({ message: "Admin access granted" });
});

export default router;