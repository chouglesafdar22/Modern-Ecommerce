import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel";
import generateToken from "../utils/generateToken";

// Register user
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const emailLower = email.toLowerCase();

    const userExist = await User.findOne({ email: emailLower });
    if (userExist) {
        res.status(400);
        throw new Error("Already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email: emailLower,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(String(user._id)),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// Login user
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email:emailLower });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(String(user._id)),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});
