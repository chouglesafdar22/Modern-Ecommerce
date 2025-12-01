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

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    brand?: string;
    category?: { _id: string; name: string }
    stock: number;
};

export default function Page() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts()
    }, []);

    const deleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted");
            fetchProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete product");
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
                            <h1 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-bold">Products</h1>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    transition={{ type: "keyframes", duration: 0.3, ease: "backInOut" }}
                                    onClick={() => router.push("/admin/products/create")}
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
                                        <th className="px-4 py-3 text-center font-normal">Image</th>
                                        <th className="px-4 py-3 text-center font-normal">Name</th>
                                        <th className="px-4 py-3 text-center font-normal">Price</th>
                                        <th className="px-4 py-3 text-center font-normal">Category</th>
                                        <th className="px-4 py-3 text-center font-normal">Brand</th>
                                        <th className="px-4 py-3 text-center font-normal">Stock</th>
                                        <th className="px-4 py-3 text-center font-normal">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {products.map((p) => (
                                        <tr key={p._id}>
                                            <td className="px-4 py-3 text-center items-center">
                                                <img src={p.image} alt={p.name} className="mx-auto w-12 h-12 object-cover rounded" />
                                            </td>
                                            <td className="px-4 py-3">{p.name}</td>
                                            <td className="px-4 py-3 text-center">{p.price}</td>
                                            <td className="px-4 py-3 text-center">
                                                {p.category?.name ?? "No Category"}
                                            </td>
                                            <td className="px-4 py-3 text-center">{p.brand ?? "No brand"}</td>
                                            <td className="px-4 py-3 text-center">{p.stock}</td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={`/admin/products/${p._id}`} className="px-3 py-1 border rounded xl:text-lg lg:text-base sm:text-sm text-xs">
                                                        <CiEdit />
                                                    </Link>
                                                    <motion.button
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                        transition={{ type: "keyframes", duration: 0.3, ease: "backInOut" }}
                                                        className="px-3 py-1 bg-red-600 text-white rounded xl:text-lg lg:text-base sm:text-sm text-xs cursor-pointer disabled:opacity-60"
                                                        onClick={() => deleteProduct(p._id)}
                                                    >
                                                        <MdDeleteForever />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                                No products yet.
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