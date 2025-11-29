"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import ScrollWrapper from "@/app/components/ScrollWrapper";
import { motion } from "framer-motion";
import api from "@/app/utils/axios";

interface ResetForm {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function ResetPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } =
        useForm<ResetForm>();

    const password = watch("password");

    useEffect(() => {
        const email = sessionStorage.getItem("resetEmail");
        if (!email) {
            toast.error("Unauthorized! Please start from Forgot Password.");
            router.push("/auth/forgot-password");
            return;
        };
        setValue("email", email);
    }, [setValue, router]);

    const onSubmit = async (data: ResetForm) => {
        if (data.password !== data.confirmPassword) {
            return toast.error("Both Passwords does not match");
        };
        setLoading(true);
        const email = sessionStorage.getItem("resetEmail");
        try {
            const res = await api.post("/users/reset-password", {
                email,
                newPassword: data.password
            });
            toast.success("Password updated!");
            sessionStorage.removeItem("resetEmail");
            router.push("/auth/login");
            reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error updating password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="light"
            />
            <section className="flex justify-center items-center min-h-screen xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 relative lg:pt-20 md:pt-14 sm:pt-10 pt-8 pb-10 bg-white">
                <ScrollWrapper direction="fade" delay={0.3}>
                    <div className="flex flex-col w-full md:max-w-md max-w-xs bg-gray-100 text-black rounded-xl p-6 shadow-lg shadow-black">
                        <h1 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-bold text-center mb-6">Reset Password</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* email */}
                            <div>
                                <label className="xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Email</label>
                                <input
                                    disabled
                                    type="email"
                                    {...register("email")}
                                    className="mt-1 w-full ring-gray-500 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                                />
                            </div>
                            {/* password */}
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
                            {/* confirmPassword */}
                            <div>
                                <label className="xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Confirm Password</label>
                                <input
                                    type="confirmPassword"
                                    placeholder="samK@!2"
                                    {...register("confirmPassword", { required: true, minLength: 6 })}
                                    className="mt-1 w-full ring-gray-500 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Confirm Password is required!</p>
                                )}
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
                                className={`w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-white transition ${loading ? "bg-gray-700 pointer-events-none cursor-not-allowed" : "bg-black cursor-pointer hover:rounded-lg hover:bg-gray-900"}`}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </motion.button>
                        </form>
                    </div>
                </ScrollWrapper>
            </section>
        </>
    );
}
