"use client"
import React, { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import { useRouter, useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { motion } from "framer-motion";

interface OrderItem {
    name: string;
    qty: number;
    image: string;
    finalPrice: number;
};

interface Order {
    _id: string;
    createdAt: string;
    orderItems: OrderItem[];
    totalPrice: number;

    paymentMethod: string;
    isPaid: boolean;
    paidAt?: string;

    isDelivered: boolean;
    deliveredAt?: string;

    invoiceUrl?: string;

    isReturnRequested: boolean;
    returnRequestedAt?: string;
    isReturned: boolean;

    shippingAddress: {
        address: string;
        city: string;
        district: string;
        state: string;
        country: string;
        pinCode: string | number;
    };

    phoneNumber: number;

    user: {
        name: string;
        email: string;
    };
};

export default function Page() {
    const params = useParams();
    const orderId = params?.orderId as string;

    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            setOrder(res.data);
        } catch (err: any) {
            toast.error("Error loading order");
            router.push("/account");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    const handleRequestReturn = async () => {
        try {
            await api.put(`/orders/${orderId}/return`);
            toast.success("Return request sent!");
            fetchOrder();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Return failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p>Loading...</p>
            </div>
        );
    };

    if (!order) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p>No order found</p>
            </div>
        );
    };

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getExpectedDelivery = (orderDate: string) => {
        const d = new Date(orderDate);
        d.setDate(d.getDate() + 7);
        return formatDate(d);
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
            <div className="max-w-3xl mx-auto p-4 min-h-screen pt-24 gap-2.5 font-sans">
                <h1 className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Order Details</h1>

                <div className="mb-4">
                    <p className="text-lg font-medium">Order ID: {order._id}</p>
                    <p className="text-gray-600">
                        Order Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="mb-5 bg-gray-100 p-4 rounded">
                    <h2 className="font-semibold text-lg mb-2">Customer Info</h2>
                    <p>{order.user.name}</p>
                    <p>{order.user.email}</p>
                    <p>{order.phoneNumber}</p>
                </div>

                <div className="mb-5 bg-gray-100 p-4 rounded">
                    <h2 className="font-semibold text-lg mb-2">Shipping Address</h2>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                        {order.shippingAddress.city} - {order.shippingAddress.pinCode}, {order.shippingAddress.district},{" "}
                        {order.shippingAddress.state}
                    </p>
                    <p>
                        {order.shippingAddress.country}
                    </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold">Payment Status</p>
                    <span
                        className={`px-3 py-1 rounded text-white ${order.isPaid ? "bg-green-600" : "bg-red-600"
                            }`}
                    >
                        {order.isPaid ? "Paid" : "Not Paid"}
                    </span>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <p className="font-semibold">Delivery Status</p>
                    <span
                        className={`px-3 py-1 rounded text-white ${order.isDelivered ? "bg-green-600" : "bg-blue-600"
                            }`}
                    >
                        {order.isDelivered ? "Delivered" : "On the way"}
                    </span>
                </div>
                <div className="bg-gray-100 p-3 rounded mb-6">
                    {!order.isDelivered ? (
                        <p className="text-gray-700 text-sm">
                            📦 <strong>Expected Delivery:</strong> {getExpectedDelivery(order.createdAt)}
                        </p>
                    ) : (
                        <p className="text-gray-700 text-sm">
                            ✅ <strong>Delivered On:</strong> {formatDate(order.deliveredAt || order.createdAt)}
                        </p>
                    )}
                </div>

                <h2 className="text-lg font-semibold mb-3">Order Items</h2>
                <div className="space-y-4 mb-6">
                    {order.orderItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between items-center border p-3 rounded"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={`http://localhost:5000${item.image}`}
                                    className="w-14 h-14 mx-auto rounded object-cover"
                                />
                                <span>
                                    {item.name} x {item.qty}
                                </span>
                            </div>
                            <span className="font-semibold text-lg">
                                ₹{item.finalPrice}
                            </span>
                        </div>
                    ))}
                </div>

                {order.invoiceUrl && (
                    <Link href={`http://localhost:5000${order.invoiceUrl}`}>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                            className="w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-white transition bg-black cursor-pointer hover:rounded-lg hover:bg-gray-900"
                        >
                            View Invoice
                        </motion.button>
                    </Link>
                )}

                {!order.isReturned && (
                    <div className="mt-4">
                        {order.isReturnRequested ? (
                            <p className="text-blue-600 font-medium">
                                Return request already sent. Waiting for approval.
                            </p>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                                onClick={handleRequestReturn}
                                className="w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-black transition bg-red-600 cursor-pointer hover:rounded-lg hover:bg-red-400"
                            >
                                Request Return
                            </motion.button>
                        )}
                    </div>
                )}

                {order.isReturned && (
                    <p className="text-green-600 font-medium mt-4">
                        ✔ Your return has been approved and completed.
                    </p>
                )}
            </div>
        </>
    )
};