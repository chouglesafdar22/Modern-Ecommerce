import { Request, Response } from "express";
import Product from "../models/productModel";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

export const addOrUpdateReview = asyncHandler(async (req: Request, res: Response) => {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        res.status(400).json({ message: "Rating must be between 1-5" });
        return;
    };

    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    };

    const exisitngReview = product.reviews.find(
        (r) => r.user.toString() === req.user?._id.toString()
    );

    if (exisitngReview) {
        exisitngReview.rating = rating;
        exisitngReview.comment = comment;
    } else {
        const review = {
            name: req.user!.name,
            rating: Number(rating),
            comment,
            user: new mongoose.Types.ObjectId(req.user!._id)
        };
        product.reviews.push(review);
    }

    product.numReviews = product.reviews.length;
    product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added or updated successfully" });
});

// get reviews of product
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).populate("reviews rating numReviews");

    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    res.json({
        reviews: product.reviews,
        rating: product.rating,
        numReviews: product.numReviews,
    });
});

// get all reviews of products (admin only)
export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find().select("name reviews").lean();

    const allReviews = products.flatMap((p) =>
        p.reviews.map((r) => ({
            productName: p.name,
            ...r
        }))
    );
    res.json(allReviews);
});

// delete review admin
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    };

    product.reviews = product.reviews.filter(
        (r: any) => r._id.toString() !== reviewId
    );

    product.numReviews = product.reviews.length;
    product.rating =
        product.reviews.length > 0
            ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length
            : 0;

    await product.save();

    res.json({ message: "Review deleted successfully" });
});