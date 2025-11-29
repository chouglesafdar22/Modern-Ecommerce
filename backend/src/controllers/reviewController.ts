import { Request, Response } from "express";
import Product from "../models/productModel";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

export const addOrUpdateReview = asyncHandler(async (req: any, res: Response) => {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        res.status(400).json({ message: "Rating must be between 1-5" });
        return;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    const existingReview = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
        existingReview.rating = rating;
        existingReview.comment = comment;
    } else {
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: new mongoose.Types.ObjectId(req.user._id),
        };

        product.reviews.push(review);
    }

    product.numReviews = product.reviews.length;
    product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added or updated successfully" });
});

// get reviews of product
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).select(
        "reviews rating numReviews"
    );

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

export const getAllReviews = asyncHandler(async (_req, res) => {
    const products = await Product.find().select("name reviews").lean();

    const allReviews = products.flatMap((p) =>
        p.reviews.map((r: any) => ({
            _id: r._id,
            name: r.name,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            product: {
                _id: p._id,
                name: p.name
            }
        }))
    );

    res.json(allReviews);
});


// user/admin can delete review 
export const deleteReview = asyncHandler(async (req: any, res: Response) => {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    const review = product.reviews.find(
        (r: any) => r._id.toString() === reviewId
    );

    if (!review) {
        res.status(404).json({ message: "Review not found" });
        return;
    }

    if (req.user.role !== "admin") {
        if (review.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: "You cannot delete someone else’s review" });
            return;
        }
    }

    product.reviews = product.reviews.filter(
        (r: any) => r._id.toString() !== reviewId
    );

    product.numReviews = product.reviews.length;
    product.rating =
        product.numReviews > 0
            ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.numReviews
            : 0;

    await product.save();

    res.json({ message: "Review deleted successfully" });
});
