import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import orderCoupon from "../models/orderCouponModel";

export const getMyCoupons = asyncHandler(async (req: Request, res: Response) => {
    const coupons = await orderCoupon.find({
        user: req.user?._id
    }).sort({ createdAt: -1 });

    res.json(coupons);
})