"use client";
import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { MdKeyboardArrowRight, MdSend } from "react-icons/md";
import { motion } from "framer-motion";
import StarRating from "@/app/components/StarRating";
import QuantitySelector from "@/app/components/QuantitySelector";
import Button, { SecondButton } from "@/app/components/Button";
import ScrollWrapper from "@/app/components/ScrollWrapper";
import FeaturesCardLayout from "@/app/components/FeatureCardsLayout";
import { MdOutlineKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

interface Product {
    id: string | number;
    title: string;
    price: number;
    image: string;
    description: string;
    stock: number;
    rating: {
        rate: number;
        count: number;
    };
}

export interface CartItem {
    id: string | number;
    title: string;
    price: number;
    image: string;
    quantity?: number;
}

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetailsPage({ product }: ProductDetailsProps) {
    const [quantity, setQuantity] = useState<number>(1);
    const [showDescription, setShowDescription] = useState<boolean>(false);
    const { addToCart, cart } = useCart();
    const [showReviews, setShowReviews] = useState<boolean>(false);

    const handleAddToCart = () => {
        const cartItem: CartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
        };
        addToCart(cartItem, quantity);
    };

    return (
        <>
            <ToastContainer />
            <ScrollWrapper direction="fade" ease="easeIn">
                <section className="flex flex-col font-sans relative lg:pt-11 md:pt-6 sm:pt-3.5 pt-2.5 pb-6 min-h-fit overflow-hidden w-screen xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 justify-center items-center bg-white gap-8">

                    {/* Breadcrumb */}
                    <div className="flex flex-row justify-start items-start gap-3 lg:mt-[76px] md:mt-[90px] sm:mt-[68px] mt-[68px] w-full md:px-2 px-1">
                        <div className="flex flex-row md:gap-1.5 gap-1 justify-center items-center text-center">
                            <Link href={"/"} className="hover:underline xl:text-lg lg:text-base sm:text-sm text-[12px] hover:text-gray-500 text-black">
                                <p>
                                    Home
                                </p>
                            </Link>
                            <MdKeyboardArrowRight className="text-gray-400 xl:text-lg lg:text-base sm:text-sm text-[12px]" />
                        </div>
                        <p className="xl:text-lg lg:text-base sm:text-sm text-[12px] text-gray-600">
                            {product.title}
                        </p>
                    </div>

                    {/* Main Grid */}
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-5 py-1.5 rounded-xl bg-gray-100 w-full">

                        {/* Product Image */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex justify-center cursor-pointer items-center w-full xl:px-4 md:px-3 px-1.5 py-3.5"
                        >
                            <Image
                                src={product.image}
                                alt={product.title}
                                width={250}
                                height={250}
                                className="object-contain transition duration-1000 ease-in-out"
                            />
                        </motion.div>

                        {/* Product Info */}
                        <div className="flex flex-col px-1.5 py-2.5">

                            <div className="flex flex-col gap-3 text-black">

                                <h3 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-medium">
                                    {product.title}
                                </h3>

                                <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-normal">
                                    ${product.price}
                                </p>

                                {/* Rating */}
                                <div className="flex flex-row gap-2.5 items-center">
                                    <div className="flex flex-row gap-1 justify-center items-center">
                                        <p className="xl:text-lg lg:text-base sm:text-sm text-[12px] font-light">
                                            {product.rating.rate}
                                        </p>
                                        <span className="xl:text-xl lg:text-lg sm:text-base text-sm">
                                            <StarRating rating={product.rating.rate} />
                                        </span>
                                    </div>
                                    <p className="xl:text-lg lg:text-base sm:text-sm text-[12px] font-light">
                                        ({product.rating.count})
                                    </p>
                                </div>

                                {/* Quantity & Add to Cart */}
                                <div className="grid md:grid-cols-2 grid-cols-1 w-full px-2 py-0.5 md:gap-5 gap-3">
                                    <QuantitySelector
                                        initial={1}
                                        min={1}
                                        max={product.stock}
                                        onChange={setQuantity}
                                    />
                                    <Button title="Add to Cart" onClick={handleAddToCart} />
                                </div>

                                {/* Description Toggle */}
                                <div className="flex flex-col gap-1.5 cursor-pointer"
                                    onClick={() => setShowDescription(!showDescription)}>
                                    <span className="flex flex-row items-center xl:text-lg lg:text-base sm:text-sm text-[12px] font-light">
                                        Description
                                        {showDescription ? <MdOutlineKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                                    </span>
                                    {showDescription && (
                                        <p className="xl:text-[17px] lg:text-[15px] sm:text-[13px] text-[11px] font-extralight">
                                            {product.description}
                                        </p>
                                    )}
                                </div>

                                {/* Reviews */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex flex-row items-center w-full gap-1.5">
                                        <input
                                            type="search"
                                            placeholder="Write the Review"
                                            className="p-1 outline-none w-1/2 border-b-2 border-gray-200 xl:text-lg lg:text-base sm:text-sm text-xs"
                                        />
                                        <MdSend className="text-gray-600 xl:text-[19px] lg:text-[17px] sm:text-[15px] text-[13px] cursor-pointer hover:text-gray-900" />
                                    </div>
                                    <div className="flex flex-col gap-1.5 cursor-pointer"
                                        onClick={() => setShowReviews(!showReviews)}>
                                        <span className="flex flex-row items-center xl:text-lg lg:text-base sm:text-sm text-[12px] font-light">
                                            Reviews
                                            {showReviews ? <MdOutlineKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                                        </span>
                                        {showReviews && (
                                            <p className="xl:text-[17px] lg:text-[15px] sm:text-[13px] text-[11px] font-extralight">
                                                No Reviews
                                            </p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </ScrollWrapper>

            {/* Features Section */}
            <ScrollWrapper direction="down" ease="easeInOut">
                <FeaturesCardLayout />
            </ScrollWrapper>
        </>
    );
}
