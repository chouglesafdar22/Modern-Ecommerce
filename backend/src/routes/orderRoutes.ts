import express from "express";
import {
    addOrderItems,
    getMyOrders,
    getAllOrders,
    requestReturn,
    approveReturn
} from "../controllers/orderController";
import { protect, admin } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/")
    .post(protect, addOrderItems)
    .get(protect, admin, getAllOrders);
router.get("/myOrders",protect,getMyOrders);
router.put("/:id/return",protect,requestReturn);
router.put("/:id/return/approve",protect,admin,approveReturn);

export default router;