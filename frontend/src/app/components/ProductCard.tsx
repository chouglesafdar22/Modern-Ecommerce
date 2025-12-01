"use client"
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SecondButton } from './Button';
import StarRating from './StarRating';

function ProductCard({ product }: any) {
    const productSlug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    const createdAtDate = new Date(product.createdAt);
    const daysDiff = (Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24);
    const isNew = daysDiff <= 30;
    const isOutOfStock = product.stock === 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", duration: 0.4, ease: "anticipate" }}
            className="group flex flex-col xl:gap-4 lg:gap-3 md:gap-2.5 sm:gap-1.5 gap-0.5 items-center rounded-xl xl:py-3.5 lg:py-3 md:py-2.5 sm:py-2 py-1.5 lg:px-3.5 md:px-2.5 sm:px-1.5 px-1 w-[300px] xl:w-[300px] max:xl:h-[400px] max:h-[400px] bg-gray-100 font-sans shadow-gray-300 shadow-md"
        >
            {/* Image Box */}
            <motion.div
                whileHover={{ scale: 1.20 }}
                className="relative w-full flex justify-center items-center"
            >
                <Image
                    src={product.image}
                    alt={product.name}
                    width={150}
                    height={150}
                    loading='eager'
                    unoptimized
                    className="object-contain py-4 lg:w-[200px] cursor-pointer lg:h-[200px]"
                />
            </motion.div>

            {/* Text Section */}
            <div className="flex flex-col gap-2 text-left w-full relative px-1">
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
                <h4 className="text-black xl:text-2xl lg:text-xl sm:text-lg text-base font-medium line-clamp-2">
                    {product.name}
                </h4>
                <span className='flex flex-1'>
                    <p className="text-black xl:text-xl lg:text-lg sm:text-base text-sm font-light line-through">
                        ₹{product.price}
                    </p>/<p className="text-black xl:text-xl lg:text-lg sm:text-base text-sm font-medium">
                        ₹{product.discountPrice}
                    </p>
                </span>
                {/* Rating Section */}
                <div className="flex flex-row gap-1.5 items-center">
                    <div className="flex flex-row gap-1 justify-center items-center text-center">
                        <p className="flex text-left xl:text-lg lg:text-base sm:text-sm text-xs font-light gap-1">
                            {product.rating.toFixed(1)}
                        </p>
                        <span className="flex justify-center text-left xl:text-xl lg:text-lg sm:text-base text-sm font-light">
                            <StarRating rating={product.rating} />
                        </span>
                    </div>
                    <p className="flex text-left xl:text-[19px] lg:text-[17px] sm:text-[15px] text-[13px] font-light gap-1">
                        ({product.numReviews})
                    </p>
                </div>
                {/* Buttons */}
                <SecondButton
                    href={`/products/${productSlug}-${product._id}`}
                    title={"View"}
                />
            </div>
        </motion.div>
    )
}

export default ProductCard;
