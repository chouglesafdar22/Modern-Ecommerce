import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import asyncHandler from "express-async-handler";

interface TokenData {
    id: string;
    role: "user" | "admin";
}

export const protect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    let token;

    // ✔ Read JWT from HTTP-ONLY COOKIE
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return
    }

    // ✔ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenData;

    // ✔ Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return
    }

    next();
});


export const admin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admin only" });
    }

    next();
};