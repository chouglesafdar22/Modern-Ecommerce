import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import asyncHandler from "express-async-handler";

interface TokenData {
    id: string;
    role: "user" | "admin"
};

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    };

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenData;
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        res.status(401).json({ message: "Unauthorized: User not found" });
    };

    // attach user to request
    (req as any).user = user;

    next();
});

export const admin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admin only" });
    }

    next();
};