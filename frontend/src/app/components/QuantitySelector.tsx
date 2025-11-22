"use client";
import React, { useEffect, useState } from "react";

interface QuantitySelectorProps {
    initial?: number;
    min?: number;
    max?: number;
    onChange?: (value: number) => void;
}

export default function QuantitySelector({
    initial = 1,
    min = 1,
    max,
    onChange,
}: QuantitySelectorProps) {
    const [count, setCount] = useState<number>(initial);

    useEffect(() => {
        if (onChange) onChange(count);
    }, [count]);

    const increase = () =>
        setCount((prev) => (max ? Math.min(prev + 1, max) : prev + 1));

    const decrease = () =>
        setCount((prev) => Math.max(prev - 1, min));

    return (
        <div className="flex flex-row w-full px-2.5 py-1 bg-gray-200 rounded-lg justify-between items-center">
            <button
                onClick={decrease}
                className="xl:text-3xl lg:text-2xl sm:text-xl text-lg px-1 py-1 font-light cursor-pointer disabled:cursor-default disabled:opacity-50"
                disabled={count <= min}
            >
                -
            </button>
            <span className="xl:text-3xl lg:text-2xl sm:text-xl text-lg font-medium">
                {count}
            </span>
            <button
                onClick={increase}
                className="xl:text-3xl lg:text-2xl sm:text-xl text-lg rounded px-1 py-1 cursor-pointer font-light disabled:cursor-default disabled:opacity-50"
                disabled={max !== undefined && count >= max}
            >
                +
            </button>
        </div>
    );
}
