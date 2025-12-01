"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ButtonProps {
    title: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

interface LinkButtonProps {
    href: string;
    title: string;
    onClick?: () => void;
    className?: string
}

export default function Button({
    onClick,
    title,
    disabled = false,
    className = "",
}: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", duration: 0.3, ease: "linear" }}
            disabled={disabled}
            onClick={onClick}
            className={`${className} flex font-sans font-light justify-center cursor-pointer text-center items-center xl:text-2xl lg:text-xl sm:text-lg text-base bg-black text-white w-auto h-auto py-2 px-2.5 rounded-md hover:rounded-lg hover:bg-gray-900 transition-all duration-500 ease-linear`}
        >
            {title}
        </motion.button>
    );
};

export function SecondButton({ href, title, className = "" }: LinkButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", duration: 0.3, ease: "linear" }}
            className={`${className} flex font-sans font-light justify-center cursor-pointer text-center items-center xl:text-2xl lg:text-xl sm:text-lg text-base bg-black text-white w-auto h-auto py-2 px-2.5 rounded-md hover:rounded-lg hover:bg-gray-900 transition-all duration-500 ease-linear`}
        >
            <Link href={href}>{title}</Link>
        </motion.button>
    );
};

export function ThirdButton({ href, title, onClick }: LinkButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", duration: 0.3, ease: "linear" }}
            onClick={onClick}
            className="flex font-sans font-light justify-center cursor-pointer text-center items-center xl:text-2xl lg:text-xl sm:text-lg text-base bg-black text-white w-auto h-auto py-2 px-2.5 rounded-md hover:rounded-lg hover:bg-white transition-all duration-500 ease-linear"
        >
            <Link href={href}>{title}</Link>
        </motion.button>
    );
};
