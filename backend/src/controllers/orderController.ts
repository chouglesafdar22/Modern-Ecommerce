import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel";

// Create new order (logged-in user only)
export const addOrderItem = asyncHandler(async (req: any, res: Response) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;
    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }
    const order = new Order({
        user: req.user._id,     
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// Get logged-in user's orders
export const getMyOrders = asyncHandler(async (req: any, res: Response) => {
    const orders = await Order.find({ user: req.user._id })
        .populate("orderItems.product", "name image price");

    res.json(orders);
});

// Get all orders (admin)
export const getAllOrders = asyncHandler(async (_req: Request, res: Response) => {
    const orders = await Order.find({})
        .populate("user", "id name email")
        .populate("orderItems.product", "name");

    res.json(orders);
});

