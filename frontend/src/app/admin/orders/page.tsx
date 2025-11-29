"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/app/utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Order {
    _id: string;
    user: { name: string, email: string };
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    returnStatus?: "none" | "requested" | "approved" | "rejected";
    createdAt: string;
};

export default function Page() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get("/orders");
            setOrders(res.data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const badge = (label: string, type: string) => {
        const colors: any = {
            paid: "bg-green-200 text-green-800",
            pending: "bg-yellow-200 text-yellow-800",
            delivered: "bg-blue-200 text-blue-800",
            notDelivered: "bg-gray-200 text-gray-800",
            returnRequested: "bg-red-200 text-red-800",
            none: "bg-gray-200 text-gray-800",
        };
        return (
            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${colors[type]}`}>
                {label}
            </span>
        );
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
                <div className="flex items-center">
                    <h1 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-bold">Orders</h1>
                </div>
                <div className="overflow-auto rounded-lg shadow">
                    <table className="w-full divide-y ">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-center font-normal">OrderId</th>
                                <th className="px-4 py-3 text-center font-normal">Customer</th>
                                <th className="px-4 py-3 text-center font-normal">Email</th>
                                <th className="px-4 py-3 text-center font-normal">Total</th>
                                <th className="px-4 py-3 text-center font-normal">Payment</th>
                                <th className="px-4 py-3 text-center font-normal">Delivery</th>
                                <th className="px-4 py-3 text-center font-normal">Return</th>
                                <th className="px-4 py-3 text-center font-normal">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="py-4 text-center text-gray-500">
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-4 text-center text-gray-500">
                                        No orders yet
                                    </td>
                                </tr>
                            ) : (
                                orders.map((o) => (
                                    <tr key={o._id} className="hover:bg-gray-100 transition">
                                        <td className="px-4 py-3 text-center">{o._id.slice(-6)}</td>
                                        <td className="px-4 py-3 text-center">{o.user?.name}</td>
                                        <td className="px-4 py-3 text-center">{o.user?.email}</td>
                                        <td className="px-4 py-3 text-center font-semibold">
                                            ₹{o.totalPrice}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {o.isPaid
                                                ? badge("Paid", "paid")
                                                : badge("Pending", "pending")}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {o.isDelivered
                                                ? badge("Delivered", "delivered")
                                                : badge("Not Delivered", "notDelivered")}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {o.returnStatus === "requested"
                                                ? badge("Requested", "returnRequested")
                                                : badge("None", "none")}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link href={`/admin/orders/${o._id}`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    transition={{ type: "keyframes", duration: 0.3, ease: "backInOut" }}
                                                    className="bg-black text-white py-1 px-3 rounded-md xl:text-base lg:text-sm cursor-pointer hover:bg-gray-900 transition-all duration-500 ease-linear sm:text-xs text-[10px] font-medium"
                                                >
                                                    View
                                                </motion.button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
};