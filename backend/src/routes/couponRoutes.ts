import express from "express";
import { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, applyCoupon } from "../controllers/couponController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, admin, createCoupon);
router.get("/", protect, getAllCoupons);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);
router.post("/apply", protect, applyCoupon);

export default router;