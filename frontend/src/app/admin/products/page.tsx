"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/app/utils/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

interface Product {
    _id: string;
    title: string;
    price: number;
    image: string;
    brand?: string;
    category?: { _id: string; name: string } | string | null;
    stock: number;
};

export default function Page() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/products");
            const data = res.data.items ?? res.data;
            setProducts(data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts()
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <p>Loading products...</p>
            </div>
        );
    };

    return (
        <div className="space-y-2 p-2 gap-2 font-sans">
            <div className="flex items-center justify-between">
                <h1 className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Products</h1>
                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ type: "keyframes", duration: 0.3, ease: "backInOut" }}
                        onClick={() => router.push("/admin/products/createProduct")}
                        className="bg-black text-white py-2 px-3 rounded-md xl:text-lg lg:text-base cursor-pointer hover:bg-gray-900 transition-all duration-500 ease-linear sm:text-sm text-xs font-medium"
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
                            <th className="px-4 py-3 text-center font-normal">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {products.map((p) => (
                            <tr key={p._id}>
                                <td className="px-4 py-3">
                                    <img src={p.image} alt={p.title} className="w-12 h-12 object-cover rounded" />
                                </td>
                                <td className="px-4 py-3">{p.title}</td>
                                <td className="px-4 py-3">${p.price}</td>
                                <td className="px-4 py-3">
                                    {typeof p.category === "object" ? (p.category as any)?.name : (p.category as any)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/product/${p._id}`} className="px-3 py-1 border rounded xl:text-lg lg:text-base sm:text-sm text-xs">
                                            <CiEdit/>
                                        </Link>
                                        <motion.button
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            transition={{ type: "keyframes", duration: 0.3, ease: "backInOut" }}
                                            className="px-3 py-1 bg-red-600 text-white rounded xl:text-lg lg:text-base sm:text-sm text-xs disabled:opacity-60"
                                        >
                                            <MdDeleteForever/>
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
        </div>
    )
}