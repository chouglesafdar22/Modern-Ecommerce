import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);

// middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));