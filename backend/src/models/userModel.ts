import mongoose, { Document, CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
};

const userSchema = new mongoose.Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" }
    },
    { timestamps: true }
);

// (userSchema as any).pre(
//     "save",
//     async function (this: IUser, next: CallbackWithoutResultAndOptionalError) {
//         if (!this.isModified("password")) return next();
//         this.password = await bcrypt.hash(this.password, 12);
//         next();
//     }
// );

const User = mongoose.model<IUser>("User", userSchema);
export default User