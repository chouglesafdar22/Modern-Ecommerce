import express from "express";
import {
    addOrderItems,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updatePaymentStatus,
    updateDeliveryStatus,
    requestReturn,
    approveReturn
} from "../controllers/orderController";
import { protect, admin } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/")
    .post(protect, addOrderItems)
    .get(protect, admin, getAllOrders);
router.get("/myOrders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/payment", protect, admin, updatePaymentStatus);
router.put("/:id/delivery", protect, admin, updateDeliveryStatus);
router.put("/:id/return", protect, requestReturn);
router.put("/:id/return/approve", protect, admin, approveReturn);

export default router;