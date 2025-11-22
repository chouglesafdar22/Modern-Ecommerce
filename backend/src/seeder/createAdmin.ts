import mongoose from "mongoose";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

(async () => {
    try {
        await mongoose.connect("mongodb+srv://ecommerce_db:cktIMrWJcLj0kv4c@cluster0.ezietja.mongodb.net/?retryWrites=true&w=majority");
        const adminExist = await User.findOne({ email: "fragrancestoreadmin@gmail.com" });
        if (adminExist) {
            console.log("admin ready success");
            process.exit();
        };
        await User.create({
            name: "FragranceStore Admin",
            email: "fragrancestoreadmin@gmail.com",
            password: await bcrypt.hash("fstoreadmin22", 10),
            isAdmin: true
        });
        console.log("Admin created successfully!");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
