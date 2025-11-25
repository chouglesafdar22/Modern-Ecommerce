import express from "express";
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController";
import {
    authMiddleware,
    adminMiddleware
} from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create", authMiddleware, adminMiddleware, createCategory);
router.get("/", getCategories);
router.put("/:id", authMiddleware, adminMiddleware, updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default router;