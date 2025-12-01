import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import { generateInvoice } from "../utils/generateInvoice";

// create new order
export const addOrderItems = asyncHandler(async (req: Request, res: Response) => {
    const { orderItems, shippingAddress, phoneNumber, paymentMethod } = req.body;

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

            const finalPrice = tax + ship + discount;

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

    const totalPrice = taxPrice + shippingFee + discountPrice;

    for (const item of orderItems) {
        const product = await Product.findById(item.product);

        if (!product) {
            throw new Error("Product not found");
        }

        if (product.stock < item.qty) {
            throw new Error(`Not enough stock for ${product.name}`);
        }

        product.stock -= item.qty;
        await product.save();
    }

    const order = new Order({
        user: req.user?._id,
        orderItems: updateOrderItems,
        shippingAddress,
        phoneNumber,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingFee,
        discountPrice,
        totalPrice,
    });

    const createdOrder = await order.save();

    // Populate fields for invoice
    const fullOrder = await Order.findById(createdOrder._id)
        .populate("user", "name email")
        .lean();

    if (!fullOrder) {
        throw new Error("Order not found while generating invoice");
    }

    const invoiceUrl = await generateInvoice(fullOrder, fullOrder.user);

    await Order.findByIdAndUpdate(fullOrder._id, { invoiceUrl }, { new: true });

    const updated = await Order.findById(fullOrder._id);
    res.status(201).json(updated);
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

// get ordeer by id
export const getOrderById = asyncHandler(async (req: any, res: Response) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "name email")
        .populate("orderItems.product", "name price image");

    if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
    }

    // Users can see only their own orders — admin can see all
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(403).json({ message: "Not authorized to view this order" });
        return;
    }

    res.json(order);
});

// 
export const updatePaymentStatus = asyncHandler(async (req: any, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
    }

    // Only admin
    if (req.user.role !== "admin") {
        res.status(403).json({ message: "Admin only" });
        return;
    }

    const { isPaid } = req.body;

    order.isPaid = isPaid;
    order.paidAt = isPaid ? new Date() : undefined;

    await order.save();

    res.json({
        message: "Payment status updated",
        order
    });
});

// 
export const updateDeliveryStatus = asyncHandler(async (req: any, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
    }

    const { isDelivered } = req.body;

    order.isDelivered = isDelivered;
    order.deliveredAt = isDelivered ? new Date() : undefined;

    await order.save();

    res.json({
        message: "Delivery status updated",
        order
    });
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

    for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
            product.stock += item.qty;
            await product.save();
        }
    }

    order.isReturned = true;
    order.isReturnRequested = false;

    await order.save();
    res.json({ message: "Return approved successfully", order });
});
