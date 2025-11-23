"use client"
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SecondButton } from './Button';
import StarRating from './StarRating';

function ProductCard({ product }: any) {
    const productSlug = product.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", duration: 0.4, ease: "anticipate" }}
            className="group flex flex-row xl:gap-4 lg:gap-3 md:gap-2.5 sm:gap-1.5 gap-0.5 items-center rounded-xl xl:py-3.5 lg:py-3 md:py-2.5 sm:py-2 py-1.5 lg:px-3.5 md:px-2.5 sm:px-1.5 px-1 max:w-[350px] max:xl:w-[480px] xl:h-[250px] h-52 bg-gray-100 font-sans"
        >
            {/* Image Box */}
            <motion.div
                whileHover={{ scale: 1.10 }}
                className="relative w-full flex justify-center items-center"
            >
                <Image
                    src={product.image}
                    alt={product.title}
                    width={110}
                    height={110}
                    className="object-contain py-4 lg:w-[350px] cursor-pointer lg:h-[350px]"
                />
            </motion.div>

            {/* Text Section */}
            <div className="flex flex-col gap-2 text-left w-full relative px-1">
                <h4 className="text-black xl:text-xl lg:text-lg sm:text-base text-sm font-medium line-clamp-2">
                    {product.title}
                </h4>
                <p className="text-black xl:text-lg lg:text-base sm:text-sm text-[12px] font-light">
                    ${product.price}
                </p>
                {/* Rating Section */}
                <div className="flex flex-row gap-2.5 items-center">
                    <div className="flex flex-row gap-1 justify-center items-center">
                        <p className="flex text-left xl:text-base lg:text-sm sm:text-[12px] text-[10px] font-light gap-1">
                            {product.rating?.rate?.toFixed(1) || 0}
                        </p>
                        <span className="flex justify-center text-left xl:text-lg lg:text-base sm:text-sm text-[12px] font-light">
                            <StarRating rating={product.rating?.rate || 0} />
                        </span>
                    </div>
                    <p className="flex text-left xl:text-[17px] lg:text-[15px] sm:text-[13px] text-[11px] font-light gap-1">
                        ({product.rating?.count || 0})
                    </p>
                </div>
                {/* Buttons */}
                <SecondButton
                    href={`/products/${productSlug}-${product.id}`}
                    title={"View"}
                />
            </div>
        </motion.div>
    )
}

export default ProductCard;
