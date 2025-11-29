import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const createToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: "2d"
    });
};

// signup
export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email.includes("@") || password.length < 6) {
            return res.status(400).json({ message: "Invalid input" });
        };

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });

        return res.status(201).json({
            message: "Signup successful",
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        };

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Wrong password" });
        };

        const token = createToken(user._id.toString(), user.role);

        const cookieExpires = 2 * 24 * 60 * 60 * 1000;

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: cookieExpires
        });

        return res.status(200).json({
            message: `${user.role} login successful`,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
;

// forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email.includes("@")) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email not found" });

        return res.status(200).json({
            message: "Email verified, go to reset password"
        });

    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

// reset-password
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword } = req.body;

        if (!email.includes("@") || newPassword.length < 6) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        return res.status(200).json({ message: "Password reset successful" });

    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

// get all users (admin only)
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find().select("name email createdAt updatedAt").sort({ createdAt: -1 });
    res.status(200).json(users);
});

// logout
export const logout = (req: Request, res: Response) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "lax",
        secure: false,
    });

    return res.status(200).json({ message: "Logged out successfully" });
};

