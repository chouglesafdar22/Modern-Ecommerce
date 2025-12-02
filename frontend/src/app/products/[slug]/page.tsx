"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdKeyboardArrowRight, MdSend } from "react-icons/md";
import { motion } from "framer-motion";
import StarRating from "@/app/components/StarRating";
import QuantitySelector from "@/app/components/QuantitySelector";
import Button from "@/app/components/Button";
import ScrollWrapper from "@/app/components/ScrollWrapper";
import FeaturesCardLayout from "@/app/components/FeatureCardsLayout";
import { MdOutlineKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import api from "@/app/utils/axios";
import { Loading } from "@/app/components/SkeletonLoading";
import Not_Found from "@/app/not-found";

interface Product {
    _id: string;
    name: string;
    price: number;
    discountPrice: number;
    taxPrice: number;
    shippingFee: number;
    brand: string;
    image: string;
    description: string;
    stock: number;
    rating: number;
    numReviews: number;
    createdAt: string;
};

interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
};

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const rawSlug = params?.slug as string;
    const id = rawSlug.split("-").pop();

    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState<number>(1);
    const [showReviews, setShowReviews] = useState<boolean>(false);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewRating, setReviewRating] = useState<number>(5);
    const [reviewComment, setReviewComment] = useState<string>("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodRes, revRes] = await Promise.all([
                api.get(`/products/${id}`),
                api.get(`/reviews/products/${id}/reviews`)
            ]);

            setProduct(prodRes.data);
            setReviews(revRes.data.reviews || []);
        } catch (err: any) {
            toast.error("Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    if (loading) {
        return (
            <>
                <Loading />
            </>
        );
    }

    if (!product) {
        return <Not_Found />
    };

    const createdAtDate = new Date(product.createdAt);
    const daysDiff = (Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24);
    const isNew = daysDiff <= 30;
    const isOutOfStock = product.stock === 0;

    const handleAddToCart = async () => {
        try {
            if (isOutOfStock) return;
            await addToCart(product._id, quantity);
        } catch (err: any) {
            toast.error("Failed to add to cart");
        }
    };

    const handleOrderNow = async () => {
        try {
            if (isOutOfStock) return;
            await addToCart(product._id, quantity);
            router.push("/checkout");
        } catch (err: any) {
            toast.error("Failed to start order");
        }
    };

    const handleSubmitReview = async () => {
        if (!reviewComment.trim()) {
            toast.error("Please write a review");
            return;
        };
        if (reviewRating < 1 || reviewRating > 5) {
            toast.error("Rating must be between 1 and 5");
            return;
        };

        try {
            setSubmittingReview(true);
            await api.post(`/reviews/products/${product._id}/reviews`, {
                rating: reviewRating,
                comment: reviewComment
            });
            toast.success("Review submitted!");

            const revRes = await api.get(
                `/reviews/products/${product._id}/reviews`
            );
            setReviews(revRes.data.reviews || []);
            setReviewComment("");
            setReviewRating(5);
        } catch (err: any) {
            if (err.response?.status === 401) {
                toast.error("Please login to write a review");
            } else {
                toast.error("Failed to submit review");
            }
        } finally {
            setSubmittingReview(false);
        }
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
                            {product.name}
                        </p>
                    </div>

                    {/* Main Grid */}
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-5 py-1.5 rounded-xl bg-gray-100 w-full">

                        {/* Product Image */}
                        <motion.div
                            whileHover={{ scale: 1.75 }}
                            className="flex justify-center cursor-pointer items-center w-full xl:px-4 md:px-3 px-1.5 py-3.5"
                        >
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={250}
                                height={250}
                                loading='eager'
                                unoptimized
                                className="object-contain transition duration-1000 ease-in-out"
                            />
                        </motion.div>

                        {/* Product Info */}
                        <div className="flex flex-col px-1.5 py-1.5">
                            <div className="flex flex-col gap-2.5 text-black">
                                <div className="flex gap-2 items-center">
                                    {isNew && !isOutOfStock && (
                                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                            NEW
                                        </span>
                                    )}
                                    {isOutOfStock && (
                                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                            OUT OF STOCK
                                        </span>
                                    )}
                                </div>
                                <h3 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-medium">
                                    {product.name}
                                </h3>
                                <span className='flex flex-1'>
                                    <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-normal line-through">
                                        ₹{product.price}
                                    </p>/<p className="xl:text-xl lg:text-lg sm:text-base text-sm font-medium">
                                        ₹{product.discountPrice}
                                    </p>
                                </span>
                                <span className="xl:text-xl lg:text-lg sm:text-base text-sm font-normal">
                                    {product.brand}
                                </span>

                                {/* Rating */}
                                <div className="flex flex-row gap-2.5 items-center">
                                    <div className="flex flex-row gap-1 justify-center items-center">
                                        <p className="xl:text-lg lg:text-base sm:text-sm text-[12px] font-light">
                                            {product.rating.toFixed(1)}
                                        </p>
                                        <span className="xl:text-xl lg:text-lg sm:text-base text-sm">
                                            <StarRating rating={product.rating} />
                                        </span>
                                    </div>
                                    <p className="xl:text-lg lg:text-base sm:text-sm text-[12px] font-light">
                                        ({product.numReviews})
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
                                    <Button
                                    className="bg-gray-600"
                                        title={
                                            isOutOfStock
                                                ? "Out of Stock"
                                                : "Add to Cart"
                                        }
                                        onClick={handleAddToCart}
                                        disabled={isOutOfStock}
                                    />
                                </div>

                                <Button
                                    title={
                                        isOutOfStock ? "Out of Stock" : "Order Now"
                                    }
                                    onClick={handleOrderNow}
                                    disabled={isOutOfStock}
                                    className={`mt-1 ${isOutOfStock
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : ""
                                        }`}
                                />

                                {/* Description*/}
                                <div className="flex flex-col gap-1.5">
                                    <span className="flex flex-row items-center xl:text-lg lg:text-base sm:text-sm text-[12px] font-light">
                                        Description
                                    </span>
                                    <p className="xl:text-[17px] lg:text-[15px] sm:text-[13px] text-[11px] font-extralight">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Reviews */}
                                <div className="flex flex-col gap-2 mt-2">
                                    {/* Write Review */}
                                    <div className="flex flex-col gap-2">
                                        <span className="xl:text-lg lg:text-base sm:text-sm text-[12px] font-light">
                                            Write a Review
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-gray-600">
                                                Rating:
                                            </label>
                                            <select
                                                value={reviewRating}
                                                onChange={(e) =>
                                                    setReviewRating(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="border rounded cursor-pointer px-2 py-1 text-xs"
                                            >
                                                {[1, 2, 3, 4, 5].map((val) => (
                                                    <option key={val} value={val}>
                                                        {val}
                                                    </option>
                                                ))}
                                            </select>
                                            <StarRating rating={reviewRating} />
                                        </div>

                                        <div className="flex flex-row items-center w-full gap-1.5">
                                            <textarea
                                                placeholder="Write your review..."
                                                value={reviewComment}
                                                onChange={(e) =>
                                                    setReviewComment(
                                                        e.target.value
                                                    )
                                                }
                                                className="p-1 outline-none w-full border border-gray-200 rounded-md xl:text-sm lg:text-sm sm:text-xs text-[11px]"
                                                rows={2}
                                            />
                                            <button
                                                onClick={handleSubmitReview}
                                                disabled={submittingReview}
                                                className="p-2 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-900 cursor-pointer disabled:bg-gray-500"
                                            >
                                                <MdSend className="text-[18px]" />
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex flex-col gap-1.5 cursor-pointer"
                                        onClick={() =>
                                            setShowReviews(!showReviews)
                                        }
                                    >
                                        <span className="flex flex-row items-center xl:text-lg lg:text-base sm:text-sm text-[12px] font-light">
                                            Reviews
                                            {showReviews ? (
                                                <MdOutlineKeyboardArrowUp />
                                            ) : (
                                                <MdKeyboardArrowDown />
                                            )}
                                        </span>

                                        {showReviews && (
                                            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mt-1">
                                                {reviews.length === 0 && (
                                                    <p className="text-gray-500 text-xs">
                                                        No reviews yet.
                                                    </p>
                                                )}

                                                {reviews.map((r) => (
                                                    <div
                                                        key={r._id}
                                                        className="border border-gray-200 rounded-md p-2 bg-white"
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-semibold">
                                                                {r.name}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-xs">
                                                                <StarRating
                                                                    rating={
                                                                        r.rating
                                                                    }
                                                                />
                                                                <span>
                                                                    {r.rating.toFixed(
                                                                        1
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-700">
                                                            {r.comment}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            {new Date(
                                                                r.createdAt
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
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
