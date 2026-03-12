import express from "express";
import {
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressById,
    getMyAddresses
} from "../controllers/addressController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, createAddress);
router.get("/", protect, getMyAddresses);
router.get("/:id", protect, getAddressById);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);

export default router;