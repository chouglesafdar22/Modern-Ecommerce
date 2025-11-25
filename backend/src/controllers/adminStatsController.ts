import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import Order from "../models/orderModel";
import Product from "../models/productModel";

export const getAdminStats = asyncHandler(async (req: Request, res: Response) => {
    //total counts
    const totalUser = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // total revenue
    const revenueData = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenues = revenueData[0]?.revenue || 0;

    // monthly sales
    const monthlySales = await Order.aggregate([
        {
            $group: {
                _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                sales: { $sum: "$totalPrice" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // low stock
    const lowStocks = await Product.find({ stock: { $lt: 10 } }).select("name stock");

    // new users in 7 days
    const newUsers = await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
        totalUser,
        totalOrders,
        totalProducts,
        totalRevenues,
        monthlySales,
        lowStocks,
        newUsers
    });
});