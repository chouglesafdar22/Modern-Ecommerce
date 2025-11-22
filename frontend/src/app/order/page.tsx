"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";

interface CartItem {
    id: string | number;
    title: string;
    image: string;
    price: number;
    quantity: number;
};

export default function Page() {
    const { clearCart,totalCartPrices } = useCart();
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [address, setAddress] = useState({
        line1: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India"
    });
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("orderItems") || "[]");
        const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
        setCartItems(cart);
        setUser(loggedUser);
    }, []);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.name]: e.target.value })
    };

    const placeOrder = () => {
        if (!address.line1 || !address.city || !address.state || !address.pinCode || !address.country) {
            toast.error("All Fields are requird!");
            return;
        };
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const newOrder = {
            id: `order_${Date.now()}`,
            user,
            items: cartItems,
            address,
            payment: paymentMethod,
            subTotal: totalCartPrices,
            status: "Success",
            date: new Date().toISOString(),
        };
        orders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(orders));
        clearCart();
        localStorage.removeItem("orderItems");
        toast.success("Order placed successfully!");
        router.push("/");
    };

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen font-sans relative lg:pt-[78px] md:pt-16 sm:pt-11 pt-[52px] pb-6 xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 bg-gray-50">
                <h1 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-bold mb-3">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="shadow shadow-black rounded-lg md:p-4 p-1.5">
                        <h2 className="font-semibold xl:text-lg lg:text-base sm:text-sm text-xs md:mb-2 mb-0.5">Your Cart</h2>
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-evenly md:mb-3 mb-1 md:p-2 p-0.5 border rounded-md">
                                <img src={item.image} alt={item.title} className="md:w-14 w-8 md:h-14 h-8 object-cover rounded-md" />
                                <div className="flex-1 md:px-3 px-1">
                                    <h3 className="xl:text-base lg:text-sm sm:text-xs text-[10px] font-medium">{item.title}</h3>
                                    <p className="xl:text-base lg:text-sm sm:text-xs text-[10px] text-gray-500">${item.price}</p>
                                </div>
                                <p className="md:ml-4 ml-2 xl:text-base lg:text-sm sm:text-xs text-[10px] font-semibold">${item.price * item.quantity}
                                </p>
                            </div>
                        ))}
                        <div className="flex justify-between md:mt-4 mt-2 font-semibold xl:text-lg lg:text-base sm:text-sm text-xs">
                            <span>Subtotal:</span>
                            <span>${subTotal}</span>
                        </div>
                    </div>
                    {/*  */}
                    <div className="shadow shadow-black rounded-lg md:p-4 p-1.5 space-y-4">
                        <h2 className="font-semibold xl:text-lg lg:text-base sm:text-sm text-xs">Delivery Details</h2>
                        <div className="space-y-2">
                            <input
                                type="text"
                                name="name"
                                value={user?.name || ""}
                                readOnly
                                className="w-full border xl:text-base lg:text-sm sm:text-xs text-[10px] px-3 py-2 rounded-md bg-gray-100"
                                placeholder="Name"
                            />
                            <input
                                type="email"
                                name="email"
                                value={user?.email || ""}
                                readOnly
                                className="w-full border xl:text-base lg:text-sm sm:text-xs text-[10px] px-3 py-2 rounded-md bg-gray-100"
                                placeholder="Email"
                            />
                            <input
                                type="text"
                                name="line1"
                                value={address.line1}
                                onChange={handleAddressChange}
                                className="w-full border xl:text-base lg:text-sm sm:text-xs text-[10px] px-3 py-2 rounded-md"
                                placeholder="Address Line 1 *"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    name="city"
                                    value={address.city}
                                    onChange={handleAddressChange}
                                    className="w-full border xl:text-base lg:text-sm sm:text-xs text-[10px] px-3 py-2 rounded-md"
                                    placeholder="City *"
                                />
                                <input
                                    type="text"
                                    name="state"
                                    value={address.state}
                                    onChange={handleAddressChange}
                                    className="w-full border xl:text-base lg:text-sm sm:text-xs text-[10px] px-3 py-2 rounded-md"
                                    placeholder="State *"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    name="pinCode"
                                    value={address.pinCode}
                                    onChange={handleAddressChange}
                                    className="w-full border xl:text-base lg:text-sm sm:text-xs text-[10px] px-3 py-2 rounded-md"
                                    placeholder="PinCode *"
                                />
                                <input
                                    type="text"
                                    name="country"
                                    value={address.country}
                                    onChange={handleAddressChange}
                                    className="w-full border xl:text-base lg:text-sm sm:text-xs text-[10px] px-3 py-2 rounded-md"
                                    placeholder="Country *"
                                />
                            </div>
                        </div>
                        <h2 className="font-semibold xl:text-lg lg:text-base sm:text-sm text-xs">Payment Method</h2>
                        <div className="flex flex-col space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="COD"
                                    checked={paymentMethod === "COD"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="xl:text-base lg:text-sm sm:text-xs text-[10px]">Cash on Delivery</span>
                            </label>
                        </div>
                        <Button title="Place Order" onClick={placeOrder} className="w-full p-2" />
                    </div >
                </div>
            </div >
        </>
    )
};