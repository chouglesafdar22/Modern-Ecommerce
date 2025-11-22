import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel";

// Get all categories
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await Category.find().sort({ name: 1 }); // sort alphabetically
    res.json(categories);
});

// Create a new category (Admin only)
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    let { name } = req.body;
    if (!name || !name.trim()) {
        res.status(400);
        throw new Error("Category name is required");
    }
    name = name.trim();
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        res.status(400);
        throw new Error("Category already exists");
    }
    const category = await Category.create({ name });
    res.status(201).json(category);
});

// update category
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryExists = await Category.findById(req.params.id);
    if (!categoryExists) {
        res.status(400);
        throw new Error("Category doesn't exists");
    };
    Object.assign(categoryExists, req.body);
    await categoryExists.save();
    res.json(categoryExists);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryExists = await Category.findById(req.params.id);
    if (!categoryExists) {
        res.status(400);
        throw new Error("Category doesn't exists");
    };
    await categoryExists.deleteOne();
    res.json({message:"Category is deleted"});
});
