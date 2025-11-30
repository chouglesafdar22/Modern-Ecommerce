import { Request, Response } from "express";
import Product from "../models/productModel";
import Category from "../models/categoryModel";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import cloudinary from "../config/cloudinary";

// 
const uploadToCloudinary = (file: Express.Multer.File) => {
    return new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "products",
                resource_type: "image",
            }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        )
            .end(file.buffer);
    });
};

// get all products
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find().populate("category", "name").sort({ createdAt: -1 });
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
    const { name, description, price, discountPrice, brand, category, stock, shippingFee, taxPrice } = req.body;

    if (!name || !req.file || !description || !price || !brand || !category || !stock || !shippingFee || !taxPrice) {
        res.status(400).json({ message: "All fields are required missing" });
        return;
    };

    // upload image to Cloudinary
    let imageUrl = "";
    try {
        const uploadResult = await uploadToCloudinary(req.file);
        imageUrl = uploadResult.secure_url;
    } catch (err) {
        res.status(500).json({ message: "Image upload failed" });
        return;
    }

    let slug = slugify(name, { lower: true, strict: true });
    const exists = await Product.findOne({ slug });
    if (exists) slug = slug + "-" + Date.now();

    let isDiscounted = false;
    if (Number(discountPrice) > 0) {
        if (Number(discountPrice) >= Number(price)) {
            res.status(400).json({
                message: "Discount price must be less than actual price",
            });
            return;
        }
        isDiscounted = true;
    };

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        res.status(400).json({ meassage: "Invalid Category Id" });
        return;
    };
    const product = await Product.create({
        name,
        slug,
        description,
        price,
        discountPrice,
        image: imageUrl,
        brand,
        category,
        stock,
        shippingFee,
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

    // if new image uploaded → upload to Cloudinary & replace url
    if (req.file) {
        try {
            const uploadResult = await uploadToCloudinary(req.file);
            product.image = uploadResult.secure_url;
        } catch (err) {
            res.status(500).json({ message: "Image upload failed" });
            return;
        }
    };

    const allowedFields = [
        "name",
        "description",
        "price",
        "discountPrice",
        "brand",
        "category",
        "stock",
        "shippingFee",
        "taxPrice",
        "image"
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            (product as any)[field] = req.body[field];
        }
    });

    if (req.body.name && req.body.name !== product.name) {
        let newSlug = slugify(req.body.name, { lower: true, strict: true });
        const exists = await Product.findOne({ slug: newSlug });

        if (exists) newSlug += "-" + Date.now();

        product.slug = newSlug;
    }

    const price = Number(product.price);
    const discount = Number(product.discountPrice);

    if (discount > 0) {
        if (discount >= price) {
            res.status(400).json({ message: "Discount price must be less than actual price" });
            return
        }
        product.isDiscounted = true;
    } else {
        product.isDiscounted = false;
    }


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

    try {
        if (product.image) {
            const urlParts = product.image.split("/");
            const fileName = urlParts[urlParts.length - 1]; 
            const publicId = "products/" + fileName.split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (err) {
        console.warn("Failed to delete image from Cloudinary:", err);
    }

    await product.deleteOne();
    res.json({ message: "Product is deleted" });
});