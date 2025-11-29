"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";
import Button, { SecondButton } from "../components/Button";

interface User {
    _id: string;
    name: string;
    email: string;
};

interface OrderItem {
    name: string;
    qty: number;
    image: string;
    finalPrice: number;
}

interface Order {
    _id: string;
    createdAt: string;
    orderItems: OrderItem[];
    totalPrice: number;
}

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAccount = async () => {
        try {
            const userRes = await api.get("/users/me");
            const ordersRes = await api.get("/orders/myOrders");

            setUser(userRes.data.user);
            setOrders(ordersRes.data);
        } catch (err: any) {
            toast.error("Please login to continue");
            router.push("/auth/login");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAccount();
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/users/logout");
            toast.success("Logged out successfully!");
            router.push("/");
        } catch (err: any) {
            toast.error("Logout failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-center font-sans relative lg:pt-[78px] md:pt-16 sm:pt-11 pt-[52px] pb-6 xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5">
                <p className="xl:text-2xl lg:text-xl sm:text-base text-sm font-semibold mb-3">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-center font-sans relative lg:pt-[78px] md:pt-16 sm:pt-11 pt-[52px] pb-6 xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5">
                <h2 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-semibold mb-3">You are not logged in</h2>
                <SecondButton href={"/auth/login"} className="w-2/6" title={"Login"} />
            </div>
        )
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
            <div className="min-h-screen font-sans relative lg:pt-[94px] md:pt-[94px] sm:pt-14 pt-16 pb-6 xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 md:max-w-3xl max-w-2xl mx-auto">
                <div className="flex flex-col justify-center items-center mb-10">
                    <FaUserCircle className="text-gray-700 xl:text-[80px] lg:text-7xl sm:text-6xl text-5xl mb-3" />
                    <h2 className="xl:text-3xl lg:text-2xl sm:text-xl text-base font-semibold">{user.name}</h2>
                    <p className="text-gray-600 xl:text-3xl lg:text-2xl sm:text-xl text-base font-normal">{user.email}</p>
                </div>
                <div className="mb-10">
                    <h3 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-semibold mb-4">Order History</h3>
                    {orders.length === 0 ? (
                        <p className="text-gray-500 xl:text-xl lg:text-lg sm:text-base text-sm">No orders yet.</p>
                    ) : (
                        <div className="flex flex-col gap-4 overflow-y-auto cursor-pointer">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    onClick={() => router.push(`/account/orders/${order._id}`)}
                                    className="border p-4 rounded-lg shadow-sm"
                                >
                                    <div className="flex justify-between mb-2">
                                        <p className="font-medium xl:text-xl lg:text-lg sm:text-base text-sm">Order ID: {order._id}</p>
                                        <p className="text-gray-600 xl:text-xl lg:text-lg sm:text-base text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {order.orderItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={`http://localhost:5000${item.image}`}
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                    <span className="xl:text-lg lg:text-base sm:text-sm text-xs">{item.name} x {item.qty}</span>
                                                </div>
                                                <span className="xl:text-xl lg:text-lg sm:text-base text-sm font-semibold">
                                                    ₹{item.finalPrice}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 xl:text-xl lg:text-lg sm:text-base text-sm font-semibold">
                                        Total: ₹{order.totalPrice}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Logout Button */}
                <div className="flex justify-center">
                    <Button onClick={handleLogout} className="w-2/6" title={"Logout"} />
                </div>
            </div>
        </>
    )
};