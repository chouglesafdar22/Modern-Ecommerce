"use client"
import React, { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

interface FormValues {
    name: string;
};

export default function Page() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<FormValues>({ mode: "onChange" });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: FormValues) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("name", values.name);

            const res = await api.post("/categories",{
                name:values.name,
            });

            toast.success("Category created successfully!");
            router.push("/admin/categories");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Create failed");
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
            <div className="py-2 px-8 overflow-x-auto">
                <h2 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-bold pb-5">Create New Product</h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 md:max-w-3xl max-w-xl bg-gray-100 p-4 rounded drop-shadow-sm drop-shadow-black"
                >
                    <div>
                        <label className="block xl:text-lg lg:text-base sm:text-sm text-xs font-medium">Name</label>
                        <input
                            {...register("name", { required: true })}
                            className="mt-1 w-full bg-gray-300 ring-gray-900 px-3 py-2 border rounded-lg focus:ring focus:ring-black"
                        />
                        {errors.name && <p className="text-red-500 xl:text-base lg:text-sm sm:text-xs
                                text-[10px] font-normal">Name is required</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                            type="submit"
                            disabled={!isValid || loading}
                            className={`w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-white transition
                                            ${isValid && !loading
                                    ? "bg-black cursor-pointer hover:rounded-lg hover:bg-gray-900"
                                    : "bg-gray-700 pointer-events-none cursor-not-allowed"
                                }
                                            `}
                        >
                            {loading ? "Saving" : "Create"}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                            type="button"
                            onClick={() => router.back()}
                            className={`w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-black transition bg-white cursor-pointer hover:rounded-lg hover:bg-gray-400`}>
                            Cancel
                        </motion.button>
                    </div>
                </form>
            </div>
        </>
    )

};