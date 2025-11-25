import mongoose, { Document, Schema } from "mongoose";

interface ICartItem {
    product: mongoose.Schema.Types.ObjectId;
    qty: number;
    price: number;
}

export interface ICart extends Document {
    user: mongoose.Schema.Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const cartItemSchema: Schema<ICartItem> = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        qty: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }
    },
    { _id: true }
);

const cartSchema: Schema<ICart> = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        items: [cartItemSchema]
    },
    { timestamps: true }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema)
export default Cart;