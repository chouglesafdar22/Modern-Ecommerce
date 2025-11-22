import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Coupon from "../models/couponModel";

// create coupon
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await Coupon.create(req.body)
    res.status(201).json(coupon);
});

// get all coupons
export const getAllCoupons = asyncHandler(async (req: Request, res: Response) => {
    const coupons = await Coupon.findOne();
    res.json(coupons);
});

// update coupon
export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        res.status(404);
        throw new Error("Coupon not Found");
    };
    Object.assign(coupon, req.body);
    await coupon.save();
    res.json(coupon);
});

// delete coupon
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        res.status(404);
        throw new Error("Coupon not Found");
    };
    await coupon.deleteOne();
    res.json({ message: "Coupon is deleted" });
});

// apply coupon
export const applyCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { code, orderAmount } = req.body;
    const userId = req.user?._id;
    if (!userId) {
        res.status(401);
        throw new Error("Not authorized");
    };
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
        res.status(400);
        throw new Error("Invalid coupon code");
    };
    const now = new Date();
    if (now < coupon.startDate || now > coupon.expiryDate) {
        res.status(400);
        throw new Error("Coupon expired or not active");
    };
    if (orderAmount < coupon.minOrderAmount) {
        res.status(400);
        throw new Error(`Order must be minimum ₹${coupon.minOrderAmount}`);
    };
    if (coupon.usageCount >= coupon.maxUsage) {
        res.status(400);
        throw new Error("Coupon usage limit reached");
    };
    const userData = coupon.usedBy.find((u) => u.user.toString() === userId.toString());
    if (userData && userData.count >= coupon.maxUsagePerUser) {
        res.status(400);
        throw new Error("You have already used this coupon");
    };
    let discount = 0;
    if (coupon.discountType === "percentage") {
        discount = (orderAmount * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount
        };
    } else {
        discount = coupon.discountValue
    }
    const finalAmount = orderAmount - discount;
    coupon.usageCount += 1;
    if (userData) {
        userData.count += 1;
    } else {
        coupon.usedBy.push({ user: userId, count: 1 });
    }
    await coupon.save();
    res.json({
        message: "Coupon applied successfully",
        discount,
        finalAmount,
    });
});