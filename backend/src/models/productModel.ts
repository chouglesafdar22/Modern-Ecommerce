import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReview {
    name: string;
    rating: number;
    comment: string;
    user: Types.ObjectId;
};

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice: number;
    isDiscounted: boolean;
    image: string;
    brand: string;
    category: mongoose.Schema.Types.ObjectId;
    stock: number;
    shippingFee: number;
    taxPrice: number;
    reviews: IReview[];
    rating: number;
    numReviews: number;
    createdAt: Date;
    updatedAt: Date;
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
        slug: { type: String, unique: true },
        description: { type: String, default: "" },
        price: { type: Number, required: true },
        discountPrice: { type: Number, default: 0 },
        isDiscounted: { type: Boolean, default: false },
        image: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        stock: { type: Number, default: 0 },
        shippingFee: { type: Number, default: 0 },
        taxPrice: { type: Number, default: 0 },
        reviews: [reviewSchema],
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;