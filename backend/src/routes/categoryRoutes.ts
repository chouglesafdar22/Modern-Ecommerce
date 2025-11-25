import express from "express";
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController";
import { protect, admin } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getCategories);
router.post("/create", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;