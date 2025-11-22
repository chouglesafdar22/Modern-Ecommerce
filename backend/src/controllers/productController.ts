import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel";
import Category from "../models/categoryModel";

// get all products
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find().populate("category", "name");
    res.json(products);
});

// get single product by id
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (product) res.json(product);
    else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// create product (admin only)
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, image, brand, category, stock } = req.body;
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        res.status(400);
        throw new Error("Invalid Category Id");
    };
    const product = await Product.create({
        name,
        description,
        price,
        image,
        brand,
        category,
        stock,
    });
    res.status(201).json(product);
});

// update product
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    };
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
});

// delete product
export const deleteProduct=asyncHandler(async(req:Request,res:Response)=>{
    const product=await Product.findById(req.params.id);
    if (!product){
        res.status(404);
        throw new Error("Product not found");
    };
    await Product.deleteOne();
    res.json({message:"Product is deleted"});
});