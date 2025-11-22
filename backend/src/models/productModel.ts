import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

export interface IReview {
    name: string;
    rating: number;
    comment: string;
    user: mongoose.Schema.Types.ObjectId;
};

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    image: string;
    brand: string;
    category: mongoose.Schema.Types.ObjectId;
    stock: number;
    reviews: IReview[];
    rating: number;
    numReviews: number;
};

const reviewSchema: Schema<IReview> = new mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

const productSchema: Schema<IProduct> = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, unique: true },
        description: { type: String },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        stock: { type: Number, default: 0 },
        reviews: [reviewSchema],
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

productSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;