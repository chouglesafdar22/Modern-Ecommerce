import { Request, Response } from "express";
import Product from "../models/productModel";
import Category from "../models/categoryModel";

// get all products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find().populate("category", "name");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// get products by id
export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id).populate("category", "name");
        if (product) res.json(product);
        else {
            res.status(404);
            throw new Error("Product not found");
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// create product (admin only)
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, discountPrice, image, brand, category, stock, ShippingFee, taxPrice } = req.body;
        if (!name || !price || !image || !brand || !category) {
            return res.status(400).json({ message: "All required fields missing" });
        };
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            res.status(400);
            throw new Error("Invalid Category Id");
        };
        const product = await Product.create({
            name,
            description,
            price,
            discountPrice,
            image,
            brand,
            category,
            stock,
            ShippingFee,
            taxPrice
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// update product details
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        };
        product.set(req.body);
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// delete product 
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        };
        await product.deleteOne();
        res.json({ message: "Product is deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};