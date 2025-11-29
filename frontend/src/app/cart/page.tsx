"use client";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";
import { MdDeleteForever } from "react-icons/md";
import ScrollWrapper from "../components/ScrollWrapper";
import QuantitySelector from "../components/QuantitySelector";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
    const router = useRouter();
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

    const handleCheckout = () => {
        router.push("/checkout");
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
            <ScrollWrapper direction="right" ease="easeIn">
                <section
                    className={`cartSection h-screen font-sans relative lg:pt-[78px] md:pt-16 sm:pt-11 pt-[52px] pb-6 xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 transition-all duration-700 ease-in-ou flex flex-col justify-between`}
                // style={{ height: "100vh" }}
                >
                    {/* Top Header */}
                    <div className="flex justify-between items-center px-4 py-1.5 sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <h2 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-semibold">
                                Your Cart
                            </h2>
                            <span className="bg-gray-100 rounded-full px-2 text-center xl:text-2xl lg:text-xl sm:text-lg text-base font-medium">
                                {cart.length}
                            </span>
                        </div>
                    </div>
                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto max:w-screen px-3 py-4">
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
                            <div className="flex flex-col gap-2">
                                {cart.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex flex-row w-full justify-between items-center border-b border-gray-300 py-3 px-2 rounded-md bg-gray-100"
                                    >
                                        {/* Image */}
                                        <img
                                            src={`http://localhost:5000${item.product.image}`}
                                            alt={item.product.name}
                                            className="w-14 h-14 object-cover rounded-md"
                                        />

                                        {/* Item Info */}
                                        <div className="flex flex-col text-left flex-1 px-3">
                                            <h4 className="font-xl:text-xl lg:text-lg sm:text-base text-sm line-clamp-2">
                                                {item.product.name}
                                            </h4>
                                            <p className="text-gray-500 xl:text-lg lg:text-base sm:text-sm text-xs">
                                                Qty: {item.qty}
                                            </p>
                                            <p className="font-semibold xl:text-xl lg:text-lg sm:text-base text-sm">
                                                ₹{item.price}
                                            </p>
                                            <p className="text-gray-500 xl:text-lg lg:text-base sm:text-sm text-xs">
                                                (Discount Price will be added in checkout page)
                                            </p>
                                        </div>

                                        {/* Quantity + Remove */}
                                        <div className="flex flex-row justify-center items-center gap-1.5">
                                            <QuantitySelector
                                                initial={item.qty}
                                                min={1}
                                                onChange={(qty) =>
                                                    updateQuantity(item.product._id, qty)
                                                }
                                            />
                                            <MdDeleteForever
                                                onClick={() => removeFromCart(item.product._id)}
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
                            <span>
                                <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-semibold">
                                    ₹{totalPrice.toFixed(2)}
                                </p>
                            </span>
                        </div>

                        <Button
                            disabled={cart.length === 0}
                            className={`w-full ${cart.length === 0
                                ? "bg-gray-700 pointer-events-none cursor-not-allowed"
                                : ""
                                }`}
                            title={"Checkout"}
                            onClick={handleCheckout}
                        />
                    </div>
                </section>
            </ScrollWrapper>
        </>
    );
}