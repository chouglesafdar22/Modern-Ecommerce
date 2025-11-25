import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import { now } from "mongoose";

// create new order
export const addOrderItems = asyncHandler(async (req: Request, res: Response) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    };

    // Totals
    let itemsPrice = 0;
    let taxPrice = 0;
    let shippingFee = 0;
    let discountPrice = 0;

    const updateOrderItems = await Promise.all(
        orderItems.map(async (item: any) => {
            const product = await Product.findById(item.product);

            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            };

            const basePrice = product.price * item.qty;
            const tax = (product.taxPrice || 0) * item.qty;
            const ship = (product.shippingFee || 0) * item.qty;
            const discount = (product.discountPrice || 0) * item.qty;

            const finalPrice = basePrice + tax + ship - discount;

            itemsPrice += basePrice;
            taxPrice += tax;
            shippingFee += ship;
            discountPrice += discount

            return {
                ...item,
                name: product.name,
                image: product.image,
                price: product.price,
                taxPrice: product.taxPrice,
                shippingFee: product.shippingFee,
                discountPrice: product.discountPrice,
                finalPrice,
            };
        })
    );

    const totalPrice = itemsPrice + taxPrice + shippingFee - discountPrice;

    const order = new Order({
        user: req.user?._id,
        orderItems: updateOrderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingFee,
        discountPrice,
        totalPrice,
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

// request return from user
export const requestReturn = asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    };

    if (order.user.toString() !== req.user?._id.toString()) {
        res.status(403);
        throw new Error("Not authorized");
    };

    if (!order.isDelivered || !order.deliveredAt) {
        res.status(400);
        throw new Error("Order is not delivered yet");
    };

    const deliveredAt = new Date(order.deliveredAt);
    const nowDate = new Date();

    const diffDays = Math.floor((nowDate.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 3) {
        res.status(400);
        throw new Error("Return period expired. You can return within 3 days of delivery");
    };

    if (order.isReturnRequested) {
        res.status(400);
        throw new Error("Return already requested");
    };

    order.isReturnRequested = true;
    order.returnRequestedAt = new Date();

    await order.save();
    res.json({ message: "Return requested successfully", order });
});

// approve returen(admin only)
export const approveReturn = asyncHandler(async (req: any, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    };

    if (!order.isReturnRequested) {
        res.status(400);
        throw new Error("Return was not requested");
    };

    order.isReturned = true;
    order.isReturnRequested = false;

    await order.save();
    res.json({ message: "Return approved successfully", order });
});
