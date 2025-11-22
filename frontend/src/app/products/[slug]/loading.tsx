"use client"
import React from 'react'
import { motion } from 'framer-motion';

export default function Loading() {
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