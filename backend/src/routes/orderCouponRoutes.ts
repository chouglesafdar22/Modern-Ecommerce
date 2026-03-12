import express from "express";
import { getMyCoupons } from "../controllers/orderCouponController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect, getMyCoupons);

export default router;