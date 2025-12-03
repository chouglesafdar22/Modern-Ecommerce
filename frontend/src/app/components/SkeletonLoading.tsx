// Skeletons.jsx
"use client";
import { motion } from "framer-motion";

// productcardSkeleton
export function ProductCardSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="group flex flex-col xl:gap-5 lg:gap-4 md:gap-3 sm:gap-2 gap-0.5 items-center rounded-xl xl:py-3.5 lg:py-3 md:py-2.5 sm:py-2 py-1.5 lg:px-3 md:px-2 sm:px-1 px-0.5 w-[300px] xl:w-[300px] max:xl:h-[400px] max:h-[400px] h-68 bg-gray-100 font-sans animate-pulse"
        >
            {/* Image Placeholder */}
            <div className="relative w-full flex justify-center items-center">
                <div className="bg-gray-300 rounded-md cursor-pointer xl:w-44 xl:h-28 w-32 h-28" />
            </div>

            {/* Text Section Placeholder */}
            <div className="flex flex-col gap-0.5 text-left w-full relative px-0.5">
                <div className="h-4 xl:h-6 bg-gray-300 rounded-md w-3/4" />
                <div className="h-3 xl:h-5 bg-gray-300 rounded-md w-2/3" />
                <div className="flex flex-row gap-0.5 items-center">
                    <div className="flex flex-row gap-px">
                        <div className="h-4 w-5 bg-gray-300 rounded"></div>
                        <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-4 w-5 bg-gray-300 rounded"></div>
                </div>
                <div className="h-7 xl:h-9 cursor-pointer bg-gray-300 rounded-lg w-32 mt-2" />
            </div>
        </motion.div>
    )
}

// featurecardSekelton
export function FeatureCardSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex xl:flex-row flex-col gap-2 font-sans justify-center items-center animate-pulse"
        >
            {/* Icon placeholder */}
            <div className="bg-gray-300 rounded-full xl:w-10 xl:h-10 lg:w-8 lg:h-8 md:w-6 md:h-6 sm:w-5 sm:h-5 w-4 h-4" />

            {/* Text placeholders */}
            <div className="flex flex-col xl:justify-start justify-center xl:items-start items-center gap-0.5 w-full">
                <div className="skeleton-box bg-gray-300 rounded-md xl:h-6 lg:h-6 md:h-5 sm:h-4 h-3 xl:w-36 lg:w-28 md:w-24 sm:w-20 w-26" />
                <div className="skeleton-box bg-gray-300 rounded-md xl:h-5 lg:h-4 md:h-3 sm:h-2.5 h-2 xl:w-52 lg:w-44 md:w-36 sm:w-28 w-24" />
            </div>
        </motion.div>
    );
}

// CategorySkeleton
export function CategorySkeleton() {
    return (
        <div className="flex flex-col gap-2 p-3 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-2 animate-pulse"
                >
                    {/* Radio button placeholder */}
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                    {/* Label placeholder */}
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                </div>
            ))}
        </div>
    )
};

// productdetailpage
export function Loading() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col font-sans relative lg:pt-9 md:pt-4 sm:pt-3 pt-1 pb-6 min-h-fit overflow-hidden w-screen xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 justify-center items-center bg-white gap-5 animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="flex flex-row justify-start items-start gap-3 lg:mt-[76px] md:mt-[90px] sm:mt-[68px] mt-[68px] w-full md:px-2 px-1">
                <div className="h-5 w-16 bg-gray-300 rounded"></div>
                <div className="h-5 w-20 bg-gray-300 rounded"></div>
            </div>

            {/* Product Section Skeleton */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 py-2.5 rounded-xl bg-gray-100 w-full">
                {/* Image Placeholder */}
                <div className="flex w-full justify-center items-center xl:px-4 md:px-3 px-1.5 py-3.5 rounded-md">
                    <div className="bg-gray-300 rounded-md xl:w-52 xl:h-[350px] w-40 h-60"></div>
                </div>

                {/* Right Side Content Skeleton */}
                <div className="flex flex-col gap-5 p-1.5">
                    <div className="flex flex-col gap-2.5 justify-start items-start">
                        <div className="h-7 w-3/4 bg-gray-300 rounded"></div> {/* Title */}
                        <div className="h-6 w-1/4 bg-gray-300 rounded"></div> {/* Price */}

                        {/* Rating Skeleton */}
                        <div className="flex flex-row gap-2 items-center">
                            <div className="flex flex-row gap-1">
                                <div className="h-5 w-8 bg-gray-300 rounded"></div>
                                <div className="h-5 w-28 bg-gray-300 rounded"></div>
                            </div>
                            <div className="h-5 w-8 bg-gray-300 rounded"></div>
                        </div>

                        {/* Quantity & Button Skeleton */}
                        <div className="grid md:grid-cols-2 grid-cols-1 w-full justify-between px-2 py-0.5 md:gap-5 gap-3">
                            <div className="h-10 bg-gray-300 rounded"></div>
                            <div className="h-10 bg-gray-300 rounded"></div>
                        </div>

                        {/* Description Skeleton */}
                        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                        {/* <div className="h-4 w-4/5 bg-gray-300 rounded"></div> */}

                        {/* Description Skeleton */}
                        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                        {/* <div className="h-4 w-4/5 bg-gray-300 rounded"></div> */}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}