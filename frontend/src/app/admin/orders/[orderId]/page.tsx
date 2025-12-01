"use client";
import React, { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    discountPrice: number;
    taxPrice: number;
    shippingPrice: number;
    finalPrice: number;
    product: string;
};

interface Order {
    _id: string;
    user: { name: string; email: string };
    orderItems: OrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        pinCode: number;
        district: string;
        state: string;
        country: string;
    };
    phoneNumber: number;
    paymentMethod: string;

    itemsPrice: number;
    taxPrice: number;
    shippingFee: number;
    discountPrice: number;
    totalPrice: number;

    isPaid: boolean;
    paidAt?: string;

    isDelivered: boolean;
    deliveredAt?: string;

    invoiceUrl?: string;

    isReturnRequested: boolean;
    returnRequestedAt?: string;
    isReturned: boolean;

    createdAt: string;
};

export default function Page() {
    const params = useParams();
    const orderId = params?.orderId as string;
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            setOrder(res.data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to load order");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    const updatePaymentStatus = async (status: boolean) => {
        try {
            setStatusLoading(true);
            await api.put(`/orders/${orderId}/payment`, { isPaid: status });
            toast.success("Payment status updated");
            fetchOrder();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setStatusLoading(false);
        }
    };

    const updateDeliveryStatus = async (status: boolean) => {
        try {
            setStatusLoading(true);
            await api.put(`/orders/${orderId}/delivery`, { isDelivered: status });
            toast.success("Delivery status updated");
            fetchOrder();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setStatusLoading(false);
        }
    };

    const approveReturn = async (status:boolean) => {
        try {
            setStatusLoading(true);
            await api.put(`/orders/${orderId}/return`, { isReturned: status });
            toast.success("Return approved");
            fetchOrder();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to approve return");
        } finally {
            setStatusLoading(false);
        }
    };

    if (loading)
        return <p className="text-center py-10 text-gray-500">Loading order...</p>;

    if (!order)
        return <p className="text-center py-10 text-gray-500">Order not found</p>;

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
            <div className="space-y-4 p-4 font-sans">
                <div className="flex justify-between items-center">
                    <h1 className="xl:text-xl lg:text-lg sm:text-base text-sm font-bold">Order #{order._id.slice(-6)}</h1>
                    
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-bold pb-5">Order Information</h2>

                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>

                    <p className="mt-2">
                        <strong>Payment Status:</strong>{" "}
                        {order.isPaid ? "Paid" : "Pending"}
                    </p>

                    <div className="flex gap-2.5 mt-2">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                            onClick={() => updatePaymentStatus(true)}
                            disabled={order.isPaid || statusLoading}
                            className="w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-black transition bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed cursor-pointer hover:rounded-lg hover:bg-green-400"
                        >
                            Mark Paid
                        </motion.button>
                    </div>

                    <p className="mt-4">
                        <strong>Delivery Status:</strong>{" "}
                        {order.isDelivered ? "Delivered" : "Not Delivered"}
                    </p>

                    <div className="flex gap-2.5 mt-2">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                            onClick={() => updateDeliveryStatus(true)}
                            disabled={order.isDelivered || statusLoading}
                            className="w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-black transition bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer hover:rounded-lg hover:bg-blue-400"
                        >
                            Mark Delivered
                        </motion.button>
                    </div>

                    <div className="mt-4">
                        <p>
                            <strong>Return Requested:</strong>{" "}
                            {order.isReturnRequested ? "Yes" : "No"}
                        </p>

                        {order.isReturnRequested && !order.isReturned && (
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                                onClick={() => approveReturn(true)}
                                className="mt-2 w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-black transition bg-red-600 cursor-pointer hover:rounded-lg hover:bg-red-400"
                            >
                                Approve Return
                            </motion.button>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-bold pb-5">Customer Info</h2>

                    <p><strong>Name:</strong> {order.user.name}</p>
                    <p><strong>Email:</strong> {order.user.email}</p>
                    <p><strong>Phone:</strong> {order.phoneNumber}</p>

                    <p className="mt-3 font-semibold">Shipping Address</p>
                    <p className="text-sm">
                        {order.shippingAddress.address}, {order.shippingAddress.city} - {" "}
                        {order.shippingAddress.pinCode}, {order.shippingAddress.district},{" "}
                        {order.shippingAddress.state}, {order.shippingAddress.country}
                    </p>
                </div>

                <div className="bg-white p-4 rounded shadow overflow-x-auto">
                    <h2 className="fxl:text-2xl lg:text-xl sm:text-lg text-base font-bold pb-5">Order Items</h2>

                    <table className="w-full divide-y ">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-center font-normal">Image</th>
                                <th className="px-4 py-3 text-center font-normal">Name</th>
                                <th className="px-4 py-3 text-center font-normal">Qty</th>
                                <th className="px-4 py-3 text-center font-normal">Price</th>
                                <th className="px-4 py-3 text-center font-normal">Discount Price</th>
                                <th className="px-4 py-3 text-center font-normal">Tax</th>
                                <th className="px-4 py-3 text-center font-normal">Shipping</th>
                                <th className="px-4 py-3 text-center font-normal">Final</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-2 py-2">
                                        <img src={item.image} className="w-14 h-14 rounded object-cover mx-auto" />
                                    </td>
                                    <td className="px-2 py-2">{item.name}</td>
                                    <td className="px-2 py-2">{item.qty}</td>
                                    <td className="px-2 py-2">₹{item.price}</td>
                                    <td className="px-2 py-2">₹{item.discountPrice}</td>
                                    <td className="px-2 py-2">₹{item.taxPrice}</td>
                                    <td className="px-2 py-2">₹{item.shippingPrice}</td>
                                    <td className="px-2 py-2 font-semibold">₹{item.finalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-right mt-4 space-y-1">
                        <p><strong>Items:</strong> ₹{order.itemsPrice}</p>
                        <p><strong>Tax:</strong> ₹{order.taxPrice}</p>
                        <p><strong>Shipping Fee:</strong> ₹{order.shippingFee}</p>
                        <p><strong>Discount:</strong> ₹{order.discountPrice}</p>
                        <p className="text-lg font-bold">Total: ₹{order.totalPrice}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                            onClick={() => router.back()}
                            className="w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-black transition bg-white cursor-pointer hover:rounded-lg hover:bg-gray-400"
                        >
                            Back
                        </motion.button>
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
                    </div>
            </div>
        </>
    )
};