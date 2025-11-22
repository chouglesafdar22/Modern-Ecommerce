import express from "express";
import { addOrderItem, getMyOrders, getAllOrders } from "../controllers/orderController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").post(protect, addOrderItem).get(protect, admin, getAllOrders);
router.get("/myOrders", protect, getMyOrders);

export default router;