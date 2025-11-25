import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

const categorySchema = new mongoose.Schema<ICategory>(
    {
        name: { type: String, required: true, unique: true }
    },
    { timestamps: true }
);

const Category=mongoose.model<ICategory>("Category", categorySchema);
export default Category;