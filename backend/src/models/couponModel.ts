import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    discountType: "percentage" | "flat";
    discountValue: number;
    maxDiscount?: number;
    minOrderAmount: number;
    startDate: Date;
    expiryDate: Date;
    maxUsage: number;
    usageCount: number;
    maxUsagePerUser: number;
    usedBy: { user: mongoose.Types.ObjectId | string; count: number }[];
};

const couponSchema = new mongoose.Schema<ICoupon>(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        discountType: { type: String, enum: ["percentage","flat"], required: true },
        discountValue: { type: Number, required: true },
        maxDiscount: { type: Number },
        minOrderAmount: { type: Number, default: 0 },
        startDate: { type: Date, required: true },
        expiryDate: { type: Date, required: true },
        maxUsage: { type: Number, default: 10 },
        usageCount: { type: Number, default: 0 },
        maxUsagePerUser: { type: Number, default: 1 },
        usedBy: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                count: { type: Number, default: 0 }
            }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ICoupon>("Coupon", couponSchema);