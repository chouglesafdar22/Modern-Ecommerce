import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import Coupon from "../models/couponModel";

export const getAdminStats = asyncHandler(async (req: Request, res: Response) => {
    // user,order,product totals
    const totalUser = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // revenue data of paid order
    const revenueData = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, revenue: { $sum: "$totalAmount" } } }
    ]);
    
    const totalRevenues = revenueData[0]?.revenue || 0;

    const monthlySales = await Order.aggregate([
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                sales: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }
        }
    ]);

    const lowStocks = await Product.find({ stock: { $lt: 10 } }).select("name stock");

    const couponUsages = await Coupon.aggregate([
        {
            $group: {
                _id: "$code",
                used: { $sum: "$usageCount" }
            }
        }
    ]);

    const newUsers = await User.countDocuments({
        createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
    });

    res.json({
        totalUser,
        totalOrders,
        totalProducts,
        totalRevenues,
        monthlySales,
        lowStocks,
        couponUsages,
        newUsers
    });
});