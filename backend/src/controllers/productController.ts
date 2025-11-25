import { Request, Response } from "express";
import Product from "../models/productModel";
import Category from "../models/categoryModel";
import asyncHandler from "express-async-handler";

// get all products
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find().populate("category", "name");
    res.status(200).json(products);
});

// get products by id
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (product) res.json(product);
    else {
        res.status(404).json({ message: "Product not found" });
    }
});

// create product (admin only)
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, discountPrice, image, brand, category, stock, ShippingFee, taxPrice } = req.body;
    if (!name || !price || !image || !brand || !category) {
        res.status(400).json({ message: "All required fields missing" });
        return;
    };
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        res.status(400).json({meassage:"Invalid Category Id"});
        return;
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
});

// update product details
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    };
    product.set(req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
});

// delete product 
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    };
    await product.deleteOne();
    res.json({ message: "Product is deleted" });
});