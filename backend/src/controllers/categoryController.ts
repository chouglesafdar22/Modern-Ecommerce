import { Request, Response } from "express";
import Category from "../models/categoryModel";
import asyncHandler from "express-async-handler";

// create category (admin only)
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
        res.status(400).json({ message: "Category name is required" });
        return
    }

    const exists = await Category.findOne({ name });
    if (exists) {
        res.status(400).json({ message: "Category already exists" });
        return
    }

    const category = await Category.create({ name });
    res.status(201).json({ message: "Category created", category });
});

// get all categories (admin only)
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
});

// update category (admin only)
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(400);
        throw new Error("Category doesn't exists");
    };
    category.set(req.body);
    const updatedCategory = await category.save();
    res.json(updatedCategory);
});

// delete category (admin only)
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryExists = await Category.findById(req.params.id);
    if (!categoryExists) {
        res.status(400);
        throw new Error("Category doesn't exists");
    };
    await categoryExists.deleteOne();
    res.json({ message: "Category is deleted" });
});
