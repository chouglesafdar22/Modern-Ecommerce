"use client";
import React from "react";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

interface StarRatingProps {
    rating: number | string;
    size?: number;
}

export default function StarRating({ rating, size = 20 }: StarRatingProps) {
    // Ensure rating is numeric
    const safeRating = Number(rating) || 0;

    // Calculate number of full, half, and empty stars
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex flex-row justify-center items-center gap-1.5 font-sans">
            {/* Full stars */}
            {Array.from({ length: fullStars }).map((_, i) => (
                <IoIosStar
                    key={`full-${i}`}
                    className="text-yellow-400 fill-yellow-400"
                    size={size}
                />
            ))}
            {/* Half star */}
            {hasHalfStar && (
                <IoIosStarHalf
                    className="text-yellow-400 fill-yellow-400"
                    size={size}
                />
            )}
            {/* Empty stars */}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <IoIosStarOutline
                    key={`empty-${i}`}
                    className="text-gray-400"
                    size={size - 2}
                />
            ))}
        </div>
    );
}
