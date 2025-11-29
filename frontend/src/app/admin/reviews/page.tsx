"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/app/utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MdDeleteForever } from "react-icons/md";

interface Review {
    _id: string;
    product: { _id: string; name: string };
    name: string;
    rating: number;
    comment: string;
};

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await api.get("/reviews");
            setReviews(res.data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const deleteReview = async (productId: string, reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            await api.delete(`/reviews/${productId}/${reviewId}`);
            toast.success("Review deleted");
            fetchReviews();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to delete review");
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
                            <h1 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-bold">Reviews</h1>
                        </div>

                        <div className="overflow-auto rounded-lg shadow">
                            <table className="w-full divide-y">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-center font-normal">Product</th>
                                        <th className="px-4 py-3 text-center font-normal">User</th>
                                        <th className="px-4 py-3 text-center font-normal">Rating</th>
                                        <th className="px-4 py-3 text-center font-normal">Comment</th>
                                        <th className="px-4 py-3 text-center font-normal">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {reviews.map((r) => (
                                        <tr key={r._id}>
                                            <td className="px-4 py-3 text-center">{r.product.name}</td>
                                            <td className="px-4 py-3 text-center">{r.name}</td>
                                            <td className="px-4 py-3 text-center">{r.rating} ⭐</td>
                                            <td className="px-4 py-3 text-center">{r.comment}</td>

                                            <td className="px-4 py-3 text-center">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
                                                    onClick={() => deleteReview(r.product._id,r._id)}
                                                >
                                                    <MdDeleteForever size={20} />
                                                </motion.button>
                                            </td>
                                        </tr>
                                    ))}

                                    {reviews.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                                No reviews yet.
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
