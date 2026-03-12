"use client";
import React, { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button, { IconButton } from "../components/Button";
import { useCart } from "../context/CartContext";
import AddressModal from "../components/AddressModal";
import { IoMdAddCircleOutline } from "react-icons/io";
import OrderCouponModal from "../components/OrderCouponModal";

interface User {
    _id: string;
    name: string;
    email: string;
};

interface Address {
    _id: string;
    address: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pinCode: number;
};

interface Coupon {
    _id: string;
    code: string;
    discountPercent: number;
    isUsed: boolean;
    expiresAt: string;
};

export default function Page() {
    const { clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [user, setUser] = useState<User | any>(null);
    const [address, setAddress] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [coupon, setCoupon] = useState<any>(null);
    const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
    const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userRes = await api.get("/users/me");
            setUser(userRes.data.user);

            const cartRes = await api.get("/carts");
            setCartItems(cartRes.data.items || []);

            const addressRes = await api.get("/address");
            setAddress(addressRes.data);

            if (addressRes.data.length > 0) {
                setSelectedAddress(addressRes.data[0]);
            }

            const couponRes = await api.get("/orderCoupons")
            const validCoupons = couponRes.data.filter(
                (c: Coupon) =>
                    !c.isUsed &&
                    new Date(c.expiresAt).getTime() > Date.now()
            );
            setActiveCoupons(validCoupons);
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
            item.product.discountPrice +
            item.product.taxPrice +
            item.product.shippingFee;

        return sum + price * item.qty;
    }, 0);

    const couponDiscount = selectedCoupon
        ? (subTotal * selectedCoupon.discountPercent) / 100
        : 0;

    const finalTotal = subTotal - couponDiscount;

    const placeOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        };

        if (!phoneNumber || phoneNumber.length !== 10) {
            toast.error("Phone number must be 10 digits");
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
                    address: selectedAddress.address,
                    city: selectedAddress.city,
                    pinCode: Number(selectedAddress.pinCode),
                    district: selectedAddress.district,
                    state: selectedAddress.state,
                    country: selectedAddress.country
                },
                phoneNumber,
                paymentMethod,
                orderCouponId: selectedCoupon?._id || null
            });
            toast.success("Order placed successfully!");

            const { updated, coupon } = res.data;

            await api.delete("/carts/clear");
            clearCart();

            setCoupon(coupon);
            setCreatedOrderId(updated._id);
            setShowCouponModal(true);
        } catch (err: any) {
            toast.error("Order failed");
            console.log(err)
        }
    };

    const handleSubmit = async (data: any) => {
        try {
            const res = await api.post("/address", data);
            setAddress((prev) => [...prev, res.data]);
            setSelectedAddress(res.data);
            setShowAddressModal(false);
            toast.success("Address Added Successfully!")
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to add address");
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
            <div className="min-h-screen font-sans relative lg:pt-20 md:pt-[66px] sm:pt-12 pt-[55px] pb-6 xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 bg-gray-50">
                <h1 className="xl:text-2xl lg:text-xl sm:text-base text-sm font-bold mb-3">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="shadow shadow-black rounded-lg md:p-4 p-1.5">
                        <h2 className="font-semibold xl:text-lg lg:text-base sm:text-sm text-xs md:mb-2 mb-0.5">Your Cart</h2>
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex items-center justify-evenly md:mb-3 mb-1 md:p-2 p-0.5 border rounded-md">
                                <img src={item.product.image} alt={item.product.name} className="md:w-14 w-8 md:h-14 h-8 object-cover rounded-md" />
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
                                                item.product.shippingFee)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between md:mt-4 mt-2 font-semibold xl:text-lg lg:text-base sm:text-sm text-xs">
                            <span>Subtotal:</span>
                            <span>₹{subTotal.toFixed(2)}</span>
                        </div>
                        {selectedCoupon && (
                            <div className="flex justify-between text-green-700">
                                <span>Coupon Discount:</span>
                                <span>- ₹{couponDiscount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold">
                            <span>Final Total:</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                        {activeCoupons.length > 0 && (
                            <>
                                <h4 className="font-semibold xl:text-lg lg:text-base sm:text-sm text-xs">
                                    Apply Coupon
                                </h4>
                                <div className="space-y-2">
                                    {activeCoupons.map((c) => (
                                        <label key={c._id}
                                            className={`border p-3 rounded-md cursor-pointer flex gap-2 ${selectedCoupon?._id === c._id ? "border-black bg-green-50" : ""
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                checked={selectedCoupon?._id === c._id}
                                                onChange={() => setSelectedCoupon(c)}
                                            />
                                            <div>
                                                <p className="font-semibold">{c.code}</p>
                                                <p className="text-green-700">{c.discountPercent}% OFF</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {/* delivery address & payment */}
                    <div className="shadow shadow-black rounded-lg md:p-4 p-1.5 space-y-4">
                        <h2 className="font-semibold xl:text-lg lg:text-base sm:text-sm text-xs">Delivery Details</h2>
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
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
                            </div>
                            <div className="w-full flex bg-gray-200 items-center border rounded">
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

                            {address.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No address found. Please add one.
                                </p>
                            ) : (
                                <div className="space-y-2.5">
                                    {address.map((addr) => (
                                        <label
                                            key={addr._id}
                                            className={`border p-3 rounded-md cursor-pointer flex gap-2 ${selectedAddress?._id === addr._id
                                                ? "border-black bg-gray-100"
                                                : ""}`}
                                        >
                                            <input
                                                type="radio"
                                                checked={selectedAddress?._id === addr._id}
                                                onChange={() => setSelectedAddress(addr)}
                                            />
                                            <div className="xl:text-base lg:text-sm sm:text-xs text-[10px]">
                                                <p className="font-normal">{addr.address}</p>
                                                <p className="font-normal">{addr.city} - {addr.pinCode}</p>
                                                <p className="font-normal">{addr.district}, {addr.state}, {addr.country}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {address.length < 2 && (
                                <IconButton
                                    icon={<IoMdAddCircleOutline />}
                                    title={"Add New Address"}
                                    className="xl:text-lg lg:text-base sm:text-sm text-xs"
                                    onClick={() => { setShowAddressModal(true) }}
                                />
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
            <AddressModal
                isOpen={showAddressModal}
                title={"Add New Address"}
                onClose={() => setShowAddressModal(false)}
                onSubmit={handleSubmit}
            />
            <OrderCouponModal
                isOpen={showCouponModal}
                coupon={coupon}
                onClose={() => {
                    setShowCouponModal(false);
                    router.push(`/account/orders/${createdOrderId}`)
                }}
            />
        </>
    )
};
