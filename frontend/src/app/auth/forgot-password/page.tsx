"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import ScrollWrapper from "@/app/components/ScrollWrapper";
import { motion } from "framer-motion";
import api from "@/app/utils/axios";

interface ForgotForm {
    email: string;
}

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotForm>();

    const onSubmit = async (data: ForgotForm) => {
        setLoading(true);
        try {
            const res = await api.post("/users/forgot-password", {
                email: data.email
            });
            toast.success(res.data.message || "Email verified!");
            sessionStorage.setItem("resetEmail", data.email);
            router.push("/auth/reset-password");
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong, Try again!");
            }
        } finally{
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
                        <h1 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-bold text-center mb-6">Forgot Password</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Enter Your Email</label>
                                <input
                                    type="email"
                                    {...register("email", { required: true })}
                                    placeholder="samKhan@gmail.com"
                                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                    className="mt-1 w-full ring-gray-500 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                                />
                                {errors.email && (
                                    <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                        text-[10px] font-normal">Email is required</p>
                                )}
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-white transition ${loading ? "bg-gray-700 pointer-events-none cursor-not-allowed" : "bg-black cursor-pointer hover:rounded-lg hover:bg-gray-900"
                                    }`}
                            >
                                {loading ? "Checking..." : "Verify Email"}
                            </motion.button>
                        </form>
                    </div>
                </ScrollWrapper>
            </section>
        </>
    );
}
