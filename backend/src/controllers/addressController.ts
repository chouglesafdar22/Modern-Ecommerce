import { Request, Response } from "express";
import Address from "../models/addressModel";
import asyncHandler from "express-async-handler";

export const createAddress = asyncHandler(async (req: Request, res: Response) => {
    const { address, city, pinCode, district, state, country } = req.body;

    if (!address || !city || !pinCode || !district || !state || !country) {
        res.status(400).json({ message: "All fields are required!" });
        return;
    }

    if (isNaN(pinCode)) {
        res.status(400).json({ message: "PinCode should be number" });
        return;
    }

    const shippingAddressCount = await Address.countDocuments({
        user: req.user?._id
    });

    if (shippingAddressCount >= 2) {
        res.status(400);
        throw new Error("You can add only 2 addresses");
    };

    const shippingAddress = await Address.create({
        user: req.user?._id,
        address,
        city,
        pinCode,
        district,
        state,
        country
    })
    res.status(201).json(shippingAddress);
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
    const shippingAddress = await Address.findById(req.params.id);
    if (!shippingAddress) {
        res.status(404);
        throw new Error("Shipping Address not found");
    };

    const allowedFields = [
        "address",
        "city",
        "pinCode",
        "district",
        "state",
        "country"
    ]

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            (shippingAddress as any)[field] = req.body[field];
        }
    });

    const updatedAddress = await shippingAddress.save();
    res.json(updatedAddress);
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    const shippingAddress = await Address.findById(req.params.id);
    if (!shippingAddress) {
        res.status(404);
        throw new Error("Shipping Address not found");
    };

    await shippingAddress.deleteOne();
    res.json({ message: "Shipping Address is deleted" })
});

export const getAddressById = asyncHandler(async (req: Request, res: Response) => {
    const shippingAddress = await Address.findById(req.params.id);
    if (!shippingAddress) {
        res.status(404);
        throw new Error("Shipping Address not found");
    };
    res.json(shippingAddress);
});

export const getMyAddresses = asyncHandler(async (req: Request, res: Response) => {
    const shippingAddress = await Address.find({
        user: req.user?._id
    }).sort({ createdAt: -1 });
    res.status(200).json(shippingAddress);
});