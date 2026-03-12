import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrderCoupon extends Document {
    user: Types.ObjectId;
    code: string;
    discountPercent: number;
    expiresAt: Date;
    isUsed: Boolean;
};

const orderCouponSchema = new mongoose.Schema<IOrderCoupon>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        code: { type: String, unique: true, required: true },
        discountPercent: { type: Number, required: true, min: 1, max: 6 },
        expiresAt: { type: Date, required: true },
        isUsed: { type: Boolean, default: false, }
    },
    { timestamps: true }
);

const orderCoupon = mongoose.model<IOrderCoupon>("orderCoupon", orderCouponSchema);
export default orderCoupon;