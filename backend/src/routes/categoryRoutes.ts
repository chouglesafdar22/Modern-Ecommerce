import express from "express";
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController";
import { protect, admin } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id",getCategoryById);
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;