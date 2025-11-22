import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel";

// add or update review only logged user
export const addOrUpdateReview = asyncHandler(async (req: Request, res: Response) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    };
    const exisitngReview = product.reviews.find(
        (r) => r.user.toString() === req.user?._id.toString()
    );
    if (exisitngReview) {
        exisitngReview.rating = rating;
        exisitngReview.comment = comment;
    } else {
        const review = {
            name: req.user?.name as string,
            rating: Number(rating),
            comment,
            user: req.user?._id?.toString() as unknown as mongoose.Schema.Types.ObjectId,
        };
        product.reviews.push(review);
    };
    // update
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added or updated successfully" });
});

// get reviews of product (public)
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).select("review rating numReviews");
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.json({
        reviews: product.reviews,
        rating: product.rating,
        numReviews: product.numReviews,
    });
});

// get all reviews (admin only)
export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.find().select("name reviews").lean();
    const allReviews = product.flatMap((p) =>
        p.reviews.map((r) => ({
            productName: p.name,
            ...r,
        }))
    );
    res.json(allReviews);
});

// delete reviews (admin only)
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    product.reviews = product.reviews.filter((r: any) => r._id?.toString !== reviewId);
    product.numReviews = product.reviews.length;
    product.rating =
        product.reviews.length > 0
            ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
            : 0;
    await product.save();
    res.json({ message: "Review deleted successfully" });
});