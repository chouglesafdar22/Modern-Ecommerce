import { Request, Response } from "express";
import Category from "../models/categoryModel";

// create category (admin only)
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const exists = await Category.findOne({ name });
        if (exists) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = await Category.create({ name });
        res.status(201).json({ message: "Category created", category });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// get all categories (admin only)
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// update category (admin only)
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        };

        res.status(200).json({ message: "Category updated", category });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// delete category (admin only)
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

