import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel";
import Cart from "../models/cartModel";

// Get current user's cart
export const getUserCart = asyncHandler(async (req: any, res: Response) => {
    const userId = req.user?._id;   
    if (!userId) {
        res.status(401);
        throw new Error("Not authorized user");
    }

    let cart = await Cart.findOne({ user: userId })
        .populate("items.product", "name price image taxPrice shippingFee discountPrice");

    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
        await cart.save();
    }

    res.json(cart);
});

// Add product to cart or increment qty
export const addToCart = asyncHandler(async (req: any, res: Response) => {
    const userId = req.user?._id;  
    const { productId, qty = 1 } = req.body;

    if (!userId) {
        res.status(401);
        throw new Error("Not authorized user");
    }
    if (!productId) {
        res.status(400);
        throw new Error("productId is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
        (i) => i.product.toString() === productId
    );

    if (existingIndex >= 0) {
        cart.items[existingIndex].qty = Math.max(1, cart.items[existingIndex].qty + Number(qty));
        cart.items[existingIndex].price = product.price;
    } else {
        cart.items.push({
            product: product._id,
            qty: Number(qty),
            price: product.price,
            discountPrice:product.discountPrice
        } as any);
    }

    await cart.save();
    await cart.populate("items.product", "name price image");

    res.json(cart);
});

// Update quantity
export const updateCartItem = asyncHandler(async (req: any, res: Response) => {
    const userId = req.user?._id;
    const { productId, qty } = req.body;

    if (!userId) {
        res.status(401);
        throw new Error("Not authorized");
    }
    if (!productId || qty === undefined) {
        res.status(400);
        throw new Error("productId and qty are required");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    const index = cart.items.findIndex((i) => i.product.toString() === productId);
    if (index === -1) {
        res.status(404);
        throw new Error("Product not in cart");
    }

    cart.items[index].qty = Math.max(1, Number(qty));

    const product = await Product.findById(productId);
    if (product) cart.items[index].price = product.price;

    await cart.save();
    await cart.populate("items.product", "name price image");

    res.json(cart);
});

// Remove product
export const removeCartItem = asyncHandler(async (req: any, res: Response) => {
    const userId = req.user?._id;
    const { productId } = req.params;

    if (!userId) {
        res.status(401);
        throw new Error("Not authorized");
    }

    if (!productId) {
        res.status(400);
        throw new Error("productId is required");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    await cart.save();
    await cart.populate("items.product", "name price image");

    res.json(cart);
});

// Clear cart
export const clearCart = asyncHandler(async (req: any, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        res.status(401);
        throw new Error("Not authorized");
    }

    const cart = await Cart.findOne({ user: userId });

    if (cart) {
        cart.items = [];
        await cart.save();
    }

    res.json({ message: "Cart cleared" });
});
