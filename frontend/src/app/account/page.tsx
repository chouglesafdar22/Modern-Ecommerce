"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";
import Button, { SecondButton } from "../components/Button";

interface User {
    name: string;
    email: string;
};

interface OrderItem {
    id: string | number;
    title: string;
    price: number;
    quantity: number;
    image: string;
};

interface Order {
    id: string;
    date: string;
    items: OrderItem[];
    subTotal: number;
};

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const logged = localStorage.getItem("loggedInUser");
        if (logged) {
            const parsed = JSON.parse(logged);
            setUser(parsed);
        };
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(savedOrders);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        toast.success("Logged out successfully!");
        router.push("/");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-center font-sans relative lg:pt-[78px] md:pt-16 sm:pt-11 pt-[52px] pb-6 xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5">
                <h2 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-semibold mb-3">You are not logged in</h2>
                <SecondButton href={"/auth/login"} title={"LogIn"} />
            </div>
        )
    };

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen font-sans relative lg:pt-[90px] md:pt-[90px] sm:pt-11 pt-14 pb-6 xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 max-w-3xl mx-auto">
                <div className="flex flex-col justify-center items-center mb-10">
                    <FaUserCircle className="text-gray-700 xl:text-9xl lg:text-8xl sm:text-7xl text-6xl mb-3" />
                    <h2 className="xl:text-3xl lg:text-2xl sm:text-xl text-base font-semibold">{user.name}</h2>
                    <p className="text-gray-600 xl:text-3xl lg:text-2xl sm:text-xl text-base">{user.email}</p>
                </div>
                <div className="mb-10">
                    <h3 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-semibold mb-4">Order History</h3>
                    {orders.length === 0 ? (
                        <p className="text-gray-500 xl:text-xl lg:text-lg sm:text-base text-sm">No orders yet.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border p-4 rounded-lg shadow-sm"
                                >
                                    <div className="flex justify-between mb-2">
                                        <p className="font-medium xl:text-xl lg:text-lg sm:text-base text-sm">Order ID: {order.id}</p>
                                        <p className="text-gray-600 xl:text-xl lg:text-lg sm:text-base text-sm">{order.date}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.image}
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                    <span className="xl:text-lg lg:text-base sm:text-sm text-xs">{item.title} x {item.quantity}</span>
                                                </div>
                                                <span className="xl:text-xl lg:text-lg sm:text-base text-sm font-semibold">
                                                    ${item.price * item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 xl:text-xl lg:text-lg sm:text-base text-sm font-semibold">
                                        Total: ${order.subTotal}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Logout Button */}
                <div className="flex justify-center">
                    <Button onClick={handleLogout} title={"LogOut"} />
                </div>
            </div>
        </>
    )
}