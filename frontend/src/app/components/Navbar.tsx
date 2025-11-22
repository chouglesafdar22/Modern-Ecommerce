"use client";
import React, { useState } from "react";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import ScrollWrapper from "./ScrollWrapper";
import { useCart } from "../context/CartContext";

export default function Navbar() {
    const { cart } = useCart();
    const pathname = usePathname();

    // Function for active link highlighting
    const isActive = (path: string) =>
        pathname === path ? "text-blue-600" : "hover:text-gray-400";

    return (
        <>
            <ScrollWrapper direction="fade" ease="easeInOut">
                <nav className="navbar bg-white z-40 flex flex-col border-b-[3px] border-b-gray-200 top-0 w-full md:py-4 py-2.5 md:px-5 px-1.5 gap-2.5 fixed">
                    <div className="navbarLinks flex flex-row justify-between items-center text-center">
                        {/* Left Side */}
                        <div className="leftSide justify-center items-center text-center">
                            <div className="logo justify-center items-center text-center">
                                <h1 className="xl:text-3xl lg:text-2xl sm:text-xl text-lg text-black font-extrabold font-sans hover:text-gray-500">
                                    <Link href="/">E-CommerceUI</Link>
                                </h1>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="rightSide flex justify-center items-center text-center">
                            <div className="navLinksRight flex flex-row justify-center items-center text-center md:gap-4 gap-1.5 xl:text-4xl lg:text-3xl sm:text-2xl text-xl text-black font-sans cursor-pointer">
                                {cart.length === 0 ? (
                                    <Link href="/cart">
                                        <IoCartOutline className={isActive("/cart")} />
                                    </Link>
                                ) : (
                                    <Link href="/cart" className="flex items-center gap-0.5">
                                        <IoCartOutline className={isActive("/cart")} />
                                        <span className="bg-gray-100 rounded-full px-2 text-center items-center xl:text-xl lg:text-lg sm:text-base text-sm font-medium">
                                            {cart.length}
                                        </span>
                                    </Link>
                                )}
                                <Link href="/account" className={isActive("/account")}>
                                    <HiOutlineUser />
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </ScrollWrapper >

        </>
    );
};
