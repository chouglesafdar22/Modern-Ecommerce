import mongoose, { Document, Schema } from "mongoose";
import { NextFunction } from "express";

export interface IReview {
    name: string;
    rating: number;
    comment: string;
    user: mongoose.Schema.Types.ObjectId;
};

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    discountPrice: number;
    isDiscounted: boolean;
    image: string;
    brand: string;
    category: mongoose.Schema.Types.ObjectId;
    stock: number;
    ShippingFee: number;
    taxPrice: number;
    reviews: IReview[];
    rating: number;
    numReviews: number;
};

const reviewSchema = new Schema<IReview>(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
);

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        price: { type: Number, required: true },
        discountPrice: { type: Number, default: 0 },
        isDiscounted: { type: Boolean, default: false },
        image: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        stock: { type: Number, default: 0 },
        ShippingFee: { type: Number, default: 0 },
        taxPrice: { type: Number, default: 0 },
        reviews: [reviewSchema],
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

productSchema.pre<IProduct>("save", function (next) {
    if (this.discountPrice > 0 && this.discountPrice < this.price) {
        this.isDiscounted = true;
    } else {
        this.isDiscounted = false;
    }
    next();
});


const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
