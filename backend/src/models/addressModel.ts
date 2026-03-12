import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAddress extends Document {
    user: Types.ObjectId;
    address: string;
    city: string;
    pinCode: number;
    district: string;
    state: string;
    country: string;
};

const addressSchema = new Schema<IAddress>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        pinCode: { type: Number, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
    },
    { timestamps: true }
)

const Address = mongoose.model<IAddress>("Address", addressSchema)
export default Address;