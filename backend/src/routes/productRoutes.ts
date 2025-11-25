import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware";

const router=express.Router();

router.get("/",getAllProducts);
router.get("/:id",getProductById);
router.post("/",authMiddleware,adminMiddleware,createProduct);
router.put("/:id",authMiddleware,adminMiddleware,updateProduct);
router.delete("/:id",authMiddleware,adminMiddleware,deleteProduct);