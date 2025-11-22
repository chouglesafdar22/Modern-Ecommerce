"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import ScrollWrapper from "@/app/components/ScrollWrapper";
import { motion } from "framer-motion";

interface ResetForm {
    password: string;
    confirmPassword: string;
}

export default function ResetPasswordPage() {
    const router = useRouter();
    const [resetEmail, setResetEmail] = useState("");

    const { register, handleSubmit, watch, formState: { errors } } =
        useForm<ResetForm>();

    const password = watch("password");

    useEffect(() => {
        const email = localStorage.getItem("resetEmail");
        if (!email) {
            toast.error("Unauthorized access");
            router.push("/auth/login");
        } else {
            setResetEmail(email);
        }
    }, [router]);

    const onSubmit = (data: ResetForm) => {
        if (data.password !== data.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        const storedUser = localStorage.getItem("registeredUser");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        user.password = data.password;
        localStorage.setItem("registeredUser", JSON.stringify(user));
        localStorage.removeItem("resetEmail");
        toast.success("Password changed successfully!");
        setTimeout(() => {
            router.push("/auth/login");
        }, 800);
    };

    return (
        <>
            <ToastContainer />
            <section className="flex justify-center items-center min-h-screen xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 relative lg:pt-20 md:pt-14 sm:pt-10 pt-8 pb-10 bg-white">
                <ScrollWrapper direction="fade" delay={0.3}>
                    <div className="flex flex-col w-full md:max-w-md max-w-sm bg-gray-100 text-black rounded-xl p-6 shadow-lg shadow-black">
                        <h1 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-bold text-center mb-6">Reset Password</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="xl:text-lg lg:text-base sm:text-sm text-xs font-medium">New Password</label>
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
                            <div>
                                <label className="xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="······"
                                    {...register("confirmPassword", { required: true, minLength: 6 })}
                                    className="mt-1 w-full ring-gray-500 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                                />
                                {watch("confirmPassword") &&
                                    watch("confirmPassword") !== password && (
                                        <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Passwords do not match</p>
                                    )}
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-white transition bg-black cursor-pointer hover:rounded-lg hover:bg-gray-900"
                            >
                                Reset Password
                            </motion.button>
                        </form>
                    </div>
                </ScrollWrapper>
            </section>
        </>
    );
}
