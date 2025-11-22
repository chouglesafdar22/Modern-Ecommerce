"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import ScrollWrapper from "@/app/components/ScrollWrapper";
import { useRouter } from "next/navigation";

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function Page() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isValid },
    } = useForm<RegisterForm>({ mode: "onChange" });

    const password = watch("password");

    const onSubmit = async (data: RegisterForm) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
            const userExists = users.some((u: any) => u.email.toLowerCase() === data.email.toLowerCase());
            if (userExists) {
                toast.error("User already exists! Please login.");
                setIsLoading(false);
                return;
            }
            const newUser = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: "user", 
            };
            users.push(newUser);
            localStorage.setItem("registeredUsers", JSON.stringify(users));
            setTimeout(() => {
                toast.success(`${data.name}, your account has been created!`);
                router.push("/auth/login");
                reset();
            }, 300);
        } catch (error) {
            toast.error("Signup failed!");
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
                        <h1 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-bold text-center mb-6">Create Account</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* name */}
                            <div>
                                <label className="xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Safdar Chougle"
                                    {...register("name", { required: true, minLength: 3 })}
                                    className="mt-1 w-full ring-gray-500 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                                />
                                {errors.name && (
                                    <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Name is required!</p>
                                )}
                            </div>
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
                            {/* password */}
                            <div>
                                <label className="xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Confirm Password</label>
                                <input
                                    type="confirmPassword"
                                    placeholder="······"
                                    {...register("confirmPassword", { required: true, minLength: 6 })}
                                    className="mt-1 w-full ring-gray-500 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                                />
                                {errors.password && (
                                    <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Confirm Password is required!</p>
                                )}
                                {watch("confirmPassword") &&
                                    watch("confirmPassword") !== password && (
                                        <p className="text-red-500 xl:text-[15px] lg:text-[13px] sm:text-[11px]
                                text-[9px] font-normal">Both Password does not match!</p>
                                    )}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                                type="submit"
                                disabled={!isValid || isLoading}
                                className={`w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-white transition
                        ${isValid && !isLoading
                                        ? "bg-black cursor-pointer hover:rounded-lg hover:bg-gray-900"
                                        : "bg-gray-700 pointer-events-none cursor-not-allowed"
                                    }
                        `}
                            >
                                {isLoading ? "Creating Account..." : "Sign up"}
                            </motion.button>
                        </form>
                        <div className="flex justify-between items-center mt-2">
                            <label className="flex items-center gap-1 xl:text-base lg:text-sm sm:text-xs text-[10px]">
                                <input
                                    type="checkbox"
                                    className="w-3 h-3"
                                />
                                I agree with <span className="text-blue-500 hover:text-blue-800 cursor-pointer hover:underline xl:text-base lg:text-sm sm:text-xs text-[10px]">Terms & condition</span>
                            </label>
                        </div>
                        <span className="text-center font-normal xl:text-base lg:text-sm sm:text-xs text-[10px] mt-2.5">
                            Already have an account? <Link
                                className="hover:underline hover:text-blue-700 hover:cursor-pointer"
                                href={"/auth/login"}
                            >Login
                            </Link>
                        </span>
                    </div>
                </ScrollWrapper>
            </section>
        </>
    )
};