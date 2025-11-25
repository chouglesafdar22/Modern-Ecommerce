import express from "express";
import {
    addOrUpdateReview,
    getAllReviews,
    getProductReviews,
    deleteReview
} from "../controllers/reviewController";
import { protect, admin } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/products/:id/reviews", getProductReviews);
router.post("/products/:id/reviews", protect, addOrUpdateReview);
router.get("/", protect, admin, getAllReviews);
router.delete("/:productId/:reviewId", protect, deleteReview);

export default router;