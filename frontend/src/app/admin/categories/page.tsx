"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/app/utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

interface Category {
    _id: string;
    name: string;
};

export default function Page() {
    const router = useRouter();
    const [categorys, setCategorys] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get("/categories");
            setCategorys(res.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const deleteCategory = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success("Category deleted");
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete category");
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
            <div className="space-y-2 p-2 gap-2 font-sans overflow-y-auto">
                {loading ? (
                    <p className="px-4 py-6 text-center text-gray-500">Loading...</p>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <h1 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-bold">Categories</h1>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    transition={{ type: "keyframes", duration: 0.3, ease: "backInOut" }}
                                    onClick={() => router.push("/admin/categories/create")}
                                    className="bg-black text-white py-1 px-3 rounded-md xl:text-base lg:text-sm cursor-pointer hover:bg-gray-900 transition-all duration-500 ease-linear sm:text-xs text-[10px] font-medium"
                                >
                                    +
                                </motion.button>
                            </div>
                        </div>
                        <div className="overflow-auto rounded-lg shadow">
                            <table className="w-full divide-y ">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-center font-normal">Name</th>
                                        <th className="px-4 py-3 text-center font-normal">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {categorys.map((c) => (
                                        <tr key={c._id}>
                                            <td className="px-4 py-3 text-center">{c.name}</td>
                                            <td className="px-4 py-3 text-center items-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={`/admin/categories/${c._id}`} className="px-3 py-1 border rounded xl:text-lg lg:text-base sm:text-sm text-xs cursor-pointer">
                                                        <CiEdit />
                                                    </Link>
                                                    <motion.button
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                        transition={{ type: "keyframes", duration: 0.3, ease: "backInOut" }}
                                                        className="px-3 py-1 bg-red-600 text-white rounded xl:text-lg lg:text-base sm:text-sm text-xs cursor-pointer disabled:opacity-60"
                                                        onClick={() => deleteCategory(c._id)}
                                                    >
                                                        <MdDeleteForever />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {categorys.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                                No categorys yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    )
};
