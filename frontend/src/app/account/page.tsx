"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";
import Button, { SecondButton, IconButton } from "../components/Button";
import { IoIosArrowUp, IoIosArrowDown, IoMdAddCircleOutline } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { motion } from "framer-motion";
import AddressModal from "../components/AddressModal";

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

interface Address {
    _id: string;
    address: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pinCode: string;
};

interface Coupon {
    _id: string;
    code: string;
    discountPercent: number;
    isUsed: boolean;
    expiresAt: string;
};

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderSection, setOrderSection] = useState(false);
    const [addressSection, setAddressSection] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [couponSection, setCouponSection] = useState(false);
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    const fetchAccount = async () => {
        try {
            const userRes = await api.get("/users/me");
            const ordersRes = await api.get("/orders/myOrders");
            const addressRes = await api.get("/address");
            const couponRes = await api.get("/orderCoupons");

            setUser(userRes.data.user);
            setOrders(ordersRes.data);
            setAddresses(addressRes.data);
            setCoupons(couponRes.data);
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

    const handelAddressSubmit = async (data: any) => {
        try {
            if (editingAddress) {
                const res = await api.put(`/address/${editingAddress._id}`, data);
                setAddresses((prev) => prev.map(addr => addr._id === editingAddress._id ? res.data : addr));
                toast.success("Address is Updated");
            } else {
                const res = await api.post("/address", data);
                setAddresses((prev) => [...prev, res.data]);
                toast.success("Address is added");
            }
            setShowAddressModal(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

    const handleDeleteAddress = async (addressId: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            await api.delete(`/address/${addressId}`);
            toast.success("Address deleted successfully");

            // Update UI without refetch
            setAddresses((prev) => prev.filter(addr => addr._id !== addressId));
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete address");
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/users/logout");
            toast.success("Logged out successfully!");
            router.push("/");
        } catch (err: any) {
            toast.error("Logout failed");
        }
    };

    const getCouponStyle = (coupon: Coupon) => {
        const isExpired = new Date(coupon.expiresAt).getTime() < Date.now();

        if (coupon.isUsed) {
            return "bg-gray-100 border-gray-300 opacity-80";
        }

        if (isExpired) {
            return "bg-red-50 border-red-200";
        }

        return "bg-green-50 border-green-200";
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
                    <FaUserCircle className="text-gray-700 xl:text-[85px] lg:text-[76px] sm:text-[65px] text-[53px] mb-3" />
                    <h2 className="xl:text-3xl lg:text-2xl sm:text-xl text-base font-semibold">{user.name}</h2>
                    <p className="text-gray-600 xl:text-3xl lg:text-2xl sm:text-xl text-base font-normal">{user.email}</p>
                </div>
                <div className="mb-10">
                    <div
                        className="flex justify-between cursor-pointer items-center mb-5"
                        onClick={() => setOrderSection(!orderSection)}
                    >
                        <h3 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-semibold">Order History ({orders.length})</h3>
                        <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-semibold">{orderSection ? <IoIosArrowUp /> : <IoIosArrowDown />}</p>
                    </div>
                    {orderSection && (
                        orders.length === 0 ? (
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
                                                            src={item.image}
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
                        )
                    )}
                </div>
                <div className="mb-10">
                    <div className="flex justify-between cursor-pointer items-center mb-5">
                        <div
                            className="flex items-center justify-center gap-3 cursor-pointer"
                            onClick={() => setAddressSection(!addressSection)}
                        >
                            <h3 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-semibold">Shipping Address</h3>
                            <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-semibold">{addressSection ? <IoIosArrowUp /> : <IoIosArrowDown />}</p>
                        </div>
                        <div>
                            {addresses.length < 2 && (
                                <IconButton
                                    icon={<IoMdAddCircleOutline />}
                                    title={"Add"}
                                    className="xl:text-base lg:text-sm sm:text-xs text-10"
                                    onClick={() => {
                                        setEditingAddress(null);
                                        setShowAddressModal(true);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    {addressSection && (
                        addresses.length === 0 ? (
                            <p className="text-gray-500 xl:text-xl lg:text-lg sm:text-base text-sm">No address added yet.</p>
                        ) : (
                            <div className="flex flex-col gap-4 overflow-y-auto">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr._id}
                                        className="border p-4 rounded-lg shadow-sm"
                                    >
                                        <p className="font-medium">
                                            {addr.address}
                                        </p>
                                        <p className="text-gray-600">
                                            {addr.city} - {addr.pinCode}
                                        </p>
                                        <p className="text-gray-600">
                                            {addr.district}, {addr.state}, {addr.country}
                                        </p>
                                        <div className="flex justify-end gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                transition={{ type: "keyframes", duration: 0.3, ease: "backInOut" }}
                                                className="px-3 py-1 border rounded xl:text-lg hover:bg-gray-200 lg:text-base sm:text-sm text-xs cursor-pointer disabled:opacity-60"
                                                onClick={() => {
                                                    setEditingAddress(addr);
                                                    setShowAddressModal(true);
                                                }}
                                            >
                                                <CiEdit />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                transition={{ type: "keyframes", duration: 0.3, ease: "backInOut" }}
                                                className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded xl:text-lg lg:text-base sm:text-sm text-xs cursor-pointer disabled:opacity-60"
                                                onClick={() => handleDeleteAddress(addr._id)}
                                            >
                                                <MdDeleteForever />
                                            </motion.button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
                <div className="mb-10">
                    <div
                        className="flex justify-between cursor-pointer items-center mb-5"
                        onClick={() => setCouponSection(!couponSection)}
                    >
                        <h3 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-semibold">
                            Coupons ({coupons.length})
                        </h3>

                        <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-semibold">
                            {couponSection ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </p>
                    </div>
                    {couponSection && (
                        coupons.length === 0 ? (
                            <p className="text-gray-500 xl:text-xl lg:text-lg sm:text-base text-sm">No coupons yet.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {coupons.map((coupon) => {
                                    const isExpired =
                                        new Date(coupon.expiresAt).getTime() < Date.now();

                                    return (
                                        <div
                                            key={coupon._id}
                                            className={`border p-4 rounded-lg shadow-sm ${getCouponStyle(coupon)}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold xl:text-xl lg:text-lg sm:text-base text-sm">
                                                    {coupon.code}
                                                </p>

                                                {coupon.isUsed ? (
                                                    <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                                                        Used
                                                    </span>
                                                ) : isExpired ? (
                                                    <span className="text-xs px-2 py-1 bg-red-200 text-red-700 rounded">
                                                        Expired
                                                    </span>
                                                ) : (
                                                    <span className="text-xs px-2 py-1 bg-green-200 text-green-700 rounded">
                                                        Active
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-2 text-gray-700">
                                                Discount: {coupon.discountPercent}%
                                            </p>

                                            <p className="text-gray-500 text-sm">
                                                Expires on{" "}
                                                {new Date(
                                                    coupon.expiresAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}
                </div>

                {/* Logout Button */}
                <div className="flex justify-center mt-5">
                    <Button onClick={handleLogout} className="max-w-3/6 mx-auto" title={"Logout"} />
                </div>
            </div>

            <AddressModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSubmit={handelAddressSubmit}
                initialData={editingAddress || undefined}
                title={editingAddress ? "Edit Address" : "Add Address"}
            />
        </>
    )
};