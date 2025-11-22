import express from "express";
import {
    addOrUpdateReview,
    getProductReviews,
    getAllReviews,
    deleteReview
} from "../controllers/reviewController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/products/:id/reviews", getProductReviews);
router.post("/products/:id/reviews", protect, addOrUpdateReview);
router.get("/", protect, admin, getAllReviews);
router.delete("/:productId/:reviewId", protect, admin, deleteReview);

export default router;