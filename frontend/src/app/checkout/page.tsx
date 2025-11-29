"use client";
import React, { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";

interface User {
    _id: string;
    name: string;
    email: string;
};

export default function Page() {
    const { clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [user, setUser] = useState<User | any>(null);
    const [address, setAddress] = useState({
        address: "",
        city: "",
        pinCode: "",
        district: "",
        state: "",
        country: "India"
    });
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const fetchData = async () => {
        try {
            setLoading(true);
            const userRes = await api.get("/users/me");
            setUser(userRes.data.user);

            const cartRes = await api.get("/carts");
            setCartItems(cartRes.data.items || []);
        } catch (error) {
            toast.error("Please login first");
            router.push("/auth/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const subTotal = cartItems.reduce((sum, item) => {
        const price =
            item.product.discountPrice+
            item.product.taxPrice +
            item.product.shippingFee;

        return sum + price * item.qty;
    }, 0);

    const handleAddressChange = (e: any) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const placeOrder = async () => {
        if (
            !address.address ||
            !address.city ||
            !address.state ||
            !address.pinCode ||
            !address.district ||
            !address.country ||
            !phoneNumber
        ) {
            toast.error("All fields are required!");
            return;
        }

        if (phoneNumber.length !== 10) {
            toast.error("Phone Number must be 10 digit");
            return;
        };

        try {
            const formattedOrderItems = cartItems.map((item) => ({
                product: item.product._id,
                qty: item.qty
            }));

            const res = await api.post("/orders", {
                orderItems: formattedOrderItems,
                shippingAddress: {
                    address: address.address,
                    city: address.city,
                    pinCode: Number(address.pinCode),
                    district: address.district,
                    state: address.state,
                    country: address.country
                },
                phoneNumber,
                paymentMethod
            });
            toast.success("Order placed successfully!");

            await api.delete("/carts/clear");
            clearCart();

            router.push(`/account/orders/${res.data._id}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Order failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
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
            <div className="min-h-screen font-sans relative lg:pt-[78px] md:pt-16 sm:pt-11 pt-[52px] pb-6 xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 bg-gray-50">
                <h1 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-bold mb-3">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="shadow shadow-black rounded-lg md:p-4 p-1.5">
                        <h2 className="font-semibold xl:text-lg lg:text-base sm:text-sm text-xs md:mb-2 mb-0.5">Your Cart</h2>
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex items-center justify-evenly md:mb-3 mb-1 md:p-2 p-0.5 border rounded-md">
                                <img src={`http://localhost:5000${item.product.image}`} alt={item.product.name} className="md:w-14 w-8 md:h-14 h-8 object-cover rounded-md" />
                                <div className="flex-1 md:px-3 px-1">
                                    <h3 className="xl:text-base lg:text-sm sm:text-xs text-[10px] font-medium">{item.product.name}</h3>
                                    <p className="xl:text-base lg:text-sm sm:text-xs text-[10px] text-gray-500">Qty: {item.qty}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-normal text-[10px] line-through">Price: ₹{item.product.price}</p>
                                    <p className="font-normal text-[10px]">Discount: ₹{item.product.discountPrice}</p>
                                    <p className="font-normal text-[10px]">Tax: ₹{item.product.taxPrice}</p>
                                    <p className="font-normal text-[10px]">Shipping: ₹{item.product.shippingFee}</p>
                                    <p className="font-medium text-[10px] text-green-700 mt-1">
                                        Final: ₹
                                        {item.qty *
                                            (item.product.discountPrice +
                                                item.product.taxPrice +
                                                item.product.shippingFee )}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between md:mt-4 mt-2 font-semibold xl:text-lg lg:text-base sm:text-sm text-xs">
                            <span>Subtotal:</span>
                            <span>₹{subTotal}</span>
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
                                name="address"
                                value={address.address}
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
                                    name="pinCode"
                                    value={address.pinCode}
                                    onChange={handleAddressChange}
                                    className="w-full border xl:text-base lg:text-sm sm:text-xs text-[10px] px-3 py-2 rounded-md"
                                    placeholder="PinCode *"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    name="district"
                                    value={address.district}
                                    onChange={handleAddressChange}
                                    className="w-full border xl:text-base lg:text-sm sm:text-xs text-[10px] px-3 py-2 rounded-md"
                                    placeholder="District *"
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
                            <input
                                type="text"
                                name="country"
                                value={address.country}
                                onChange={handleAddressChange}
                                className="w-full border xl:text-base lg:text-sm sm:text-xs text-[10px] px-3 py-2 rounded-md"
                                placeholder="Country *"
                            />
                            <div className="w-full flex items-center border rounded">
                                <span className="px-3 py-2 bg-gray-200 text-sm font-medium select-none">
                                    +91
                                </span>

                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    maxLength={10}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        if (value.length <= 10) setPhoneNumber(value);
                                    }}
                                    className="w-full border xl:text-base lg:text-sm sm:text-xs text-[10px] px-3 py-2 rounded-md"
                                    placeholder="Phone Number (10 digits)"
                                />
                            </div>

                            {/* Optional error */}
                            {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                                <p className="text-red-500 text-xs mt-1">Phone number must be 10 digits</p>
                            )}

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
                                <span className="xl:text-base lg:text-sm sm:text-xs text-[10px]">Cash on Delivery (COD)</span>
                            </label>
                        </div>
                        <Button title="Place Order" onClick={placeOrder} className="w-full p-2" />
                    </div >
                </div>
            </div >
        </>
    )
};