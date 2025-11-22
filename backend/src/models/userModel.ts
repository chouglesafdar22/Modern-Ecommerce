import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
