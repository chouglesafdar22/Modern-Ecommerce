import express from "express";
import {
    getUserCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cartController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect, getUserCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);

export default router;