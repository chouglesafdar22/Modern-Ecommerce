"use client";
import React, { useState, useRef } from "react";
import Button from "./Button";
import { IoClose } from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { MdDeleteForever } from "react-icons/md";
import ScrollWrapper from "./ScrollWrapper";
import QuantitySelector from "./QuantitySelector";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoCartOutline } from "react-icons/io5";

interface CartItem {
    id: string | number;
    title: string;
    image: string;
    price: number;
    quantity: number;
}

interface Props {
    isCart: boolean;
    onClick: () => void;
}

export default function CartSider() {
    const [isCart, setIsCart] = useState<boolean>(false);
    const router = useRouter();
    const { cart, removeFromCart, updateQuantity } = useCart();
    const subTotal = cart.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

    const handleOrder = () => {
        const loggedUser = localStorage.getItem("loggedInUser");
        if (!loggedUser) {
            toast.error("Please login first to place order");
            return router.push("/auth/login");
        }
        // Save cart items for order page
        localStorage.setItem("orderItems", JSON.stringify(cart));
        setIsCart(false);
        router.push("/order");
    };

    return (
        <>
            <ScrollWrapper direction="right" ease="easeIn">
                <section
                    className={`cartSection fixed top-0 right-0 z-40 px-2 transition-all duration-700 ease-in-out 
                    ${isCart ? "block xl:w-[680px] lg:w-[580px] md:w-[500px] sm:w-[420px] w-[340px]" : "hidden w-0 opacity-0"} bg-white border-l-[3px] border-l-gray-200 flex flex-col justify-between`}
                    style={{ height: "100vh" }}
                >
                    {/* Top Header */}
                    <div className="flex justify-between items-center px-4 py-4 border-b border-b-gray-400 sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <h2 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-semibold">
                                Your Cart
                            </h2>
                            <span className="bg-gray-100 rounded-full px-2 text-center xl:text-2xl lg:text-xl sm:text-lg text-base font-medium">
                                {cart.length}
                            </span>
                        </div>
                        <IoClose
                            onClick={() => setIsCart(false)}
                            className="cursor-pointer xl:text-2xl lg:text-xl sm:text-lg text-base hover:text-gray-400"
                        />
                    </div>
                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-3 py-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col justify-center items-center text-center">
                                <h5 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-medium">
                                    Your Cart is Empty
                                </h5>
                                <p className="text-gray-500 xl:text-xl lg:text-lg sm:text-base text-sm">
                                    Add some items to cart
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-2">
                                {cart.map((item: CartItem, index: number) => (
                                    <div
                                        key={index}
                                        className="flex flex-row justify-between items-center border-b border-gray-300 py-3 px-2 rounded-md bg-gray-100"
                                    >
                                        {/* Image */}
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-14 h-14 object-cover rounded-md"
                                        />

                                        {/* Item Info */}
                                        <div className="flex flex-col text-left flex-1 px-3">
                                            <h4 className="font-xl:text-xl lg:text-lg sm:text-base text-sm line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-gray-500 xl:text-lg lg:text-base sm:text-sm text-xs">
                                                Qty: {item.quantity}
                                            </p>
                                            <p className="font-semibold xl:text-xl lg:text-lg sm:text-base text-sm">
                                                ₹{item.price}
                                            </p>
                                        </div>

                                        {/* Quantity + Remove */}
                                        <div className="flex flex-row justify-center items-center gap-1.5">
                                            <QuantitySelector
                                                initial={item.quantity}
                                                min={1}
                                                onChange={(qty) =>
                                                    updateQuantity(item.id, qty)
                                                }
                                            />
                                            <MdDeleteForever
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 xl:text-4xl lg:text-3xl sm:text-2xl text-xl cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Footer */}
                    <div className="border-t border-t-gray-400 px-6 py-4 bg-white sticky bottom-0">
                        <div className="flex justify-between items-center mb-3">
                            <h6 className="xl:text-xl lg:text-lg sm:text-base text-sm font-medium">
                                SubTotal:
                            </h6>
                            <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-semibold">
                                ${subTotal.toFixed(2)}
                            </p>
                        </div>

                        <Button
                            disabled={cart.length === 0}
                            className={`w-full ${cart.length === 0
                                ? "bg-gray-700 pointer-events-none cursor-not-allowed"
                                : ""
                                }`}
                            title={"Order"}
                            onClick={handleOrder}
                        />
                    </div>
                </section>
            </ScrollWrapper>
        </>
    );
}
