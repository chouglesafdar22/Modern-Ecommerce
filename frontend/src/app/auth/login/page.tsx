"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ScrollWrapper from "@/app/components/ScrollWrapper";
import { motion } from "framer-motion";

interface LoginForm {
    email: string;
    password: string;
}

export default function Page() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<LoginForm>();

    const email = watch("email");
    const password = watch("password");

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const { email, password } = data;
            // admin login
            if (
                email === "ecommerceuiadmin@gmail.com" &&
                password === "ecommerceuiadmin22"
            ) {
                toast.success("Welcome Admin!");
                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify({ email, role: "admin" })
                );
                router.push("/admin");
                return;
            }
            // normal user login
            const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
            const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
            if (!user) {
                toast.error("User not found! Please sign up first.");
                return;
            }
            if (user.password !== password) {
                toast.error("Incorrect password!");
                return;
            }
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({ email: user.email, name: user.name, role: "user" })
            );
            toast.success("Login Successful!");
            reset();
            router.push("/");
        } catch (error) {
            toast.error("Login Failed");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <ToastContainer />
            <section className="flex justify-center items-center min-h-screen xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 relative lg:pt-20 md:pt-14 sm:pt-10 pt-8 pb-10 bg-white">
                <ScrollWrapper direction="fade" delay={0.3}>
                    <div className="flex flex-col w-full md:max-w-md max-w-sm bg-gray-100 text-black rounded-xl p-6 shadow-lg shadow-black">
                        <h1 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-bold text-center mb-6">Welcome Back!</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* email */}
                            <div>
                                <label className="xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Email</label>
                                <input
                                    type="email"
                                    placeholder="safdarchougle@gmail.com"
                                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                    {...register("email", { required: true })}
                                    className="mt-1 w-full ring-gray-500 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                                />
                                {errors.email && (
                                    <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                        text-[10px] font-normal">Email is required!</p>
                                )}
                            </div>
                            {/* password */}
                            <div>
                                <label className="xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Password</label>
                                <input
                                    type="password"
                                    placeholder="······"
                                    {...register("password", { required: true, minLength: 6 })}
                                    className="mt-1 w-full ring-gray-500 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                                />
                                {errors.password && (
                                    <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                        text-[10px] font-normal">Password must be atleast 6 Characters</p>
                                )}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                                type="submit"
                                disabled={!email || !password || isLoading}
                                className={`w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-white transition
                                ${!email || !password || isLoading
                                        ? "bg-gray-700 pointer-events-none cursor-not-allowed"
                                        : "bg-black cursor-pointer hover:rounded-lg hover:bg-gray-900"
                                    }`}
                            >
                                {isLoading ? "Logining..." : "Login"}
                            </motion.button>
                        </form>
                        <div className="flex justify-between items-center mt-2">
                            <label className="flex items-center gap-1 xl:text-base lg:text-sm sm:text-xs text-[10px]">
                                <input
                                    type="checkbox"
                                    className="w-3 h-3"
                                />
                                Remember me
                            </label>
                            <Link
                                href={"/auth/forgot-password"}
                                className="text-blue-500 hover:text-blue-800 cursor-pointer hover:underline xl:text-base lg:text-sm sm:text-xs text-[10px]"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <span className="text-center font-normal xl:text-base lg:text-sm sm:text-xs text-[10px] mt-2.5">
                            You Don't have account? <Link
                                className="hover:underline hover:text-blue-700 hover:cursor-pointer"
                                href={"/auth/signup"}
                            >Create Account
                            </Link>
                        </span>
                    </div>
                </ScrollWrapper>
            </section>
        </>
    )
};