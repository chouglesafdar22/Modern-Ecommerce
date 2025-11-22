import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/userModel";

interface DecodedToken {
    id: string,
    iat: number,
    exp: number
};

// protect routes (if logged in only)
export const protect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
            req.user = await User.findById(decoded.id).select("-password") as IUser;
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    };
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    };
});

// only admin
export const admin = (req: any, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(404);
        throw new Error("Not authorized as admin");
    }
};