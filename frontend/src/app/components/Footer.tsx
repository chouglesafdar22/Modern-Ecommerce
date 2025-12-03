"use client"
import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ScrollWrapper from "./ScrollWrapper";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <ScrollWrapper direction='fade' ease='linear'>
            <footer className='flex flex-col bottom-0 relative w-full pt-20 pb-10 px-6 bg-black text-white font-sans gap-4'>
                <div className='grid xl:grid-cols-3 grid-cols-1 gap-4'>
                    <div className='flex flex-col justify-start items-start gap-4'>
                        <h2 className='items-start xl:text-2xl lg:text-xl sm:text-lg text-base font-bold'>FragranceStore</h2>
                        <p className='items-start xl:text-lg lg:text-base sm:text-sm text-[12px]'>Crafting elegance through every fragrance note.</p>
                        {/* Discover timeless timepieces for effortless elegance. */}
                        <div className='flex flex-row gap-3 justify-center items-center'>
                            <div className="facebook flex items-center cursor-pointer justify-center text-center size-8 bg-white hover:bg-gray-200 text-black rounded-full">
                                <Link href={"https://www.facebook.com/"}><FaFacebookF /></Link>
                            </div>
                            <div className="instagram flex items-center cursor-pointer justify-center text-center size-8 bg-white hover:bg-gray-200 text-black rounded-full">
                                <Link href={"https://www.instagram.com/"}><FaInstagram /></Link>
                            </div>
                            <div className="twitter flex items-center cursor-pointer justify-center text-center size-8 bg-white hover:bg-gray-200 text-black rounded-full">
                                <Link href={"https://www.x.com/"}><FaXTwitter /></Link>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1.5 justify-center items-center text-center px-0'>
                        <h5 className='items-start text-left xl:text-xl lg:text-lg sm:text-base text-sm font-medium'>Links</h5>
                        <Link href={"/"} className='items-start hover:text-blue-600 hover:underline wrap-break-word text-left xl:text-lg lg:text-base sm:text-sm text-[12px]'>
                            Home
                        </Link>
                        <Link href={"/auth/login"} className='items-start hover:text-blue-600 hover:underline wrap-break-word text-left xl:text-lg lg:text-base sm:text-sm text-[12px]'>
                            Login
                        </Link>
                        <Link href={"/auth/account"} className='items-start hover:text-blue-600 hover:underline wrap-break-word text-left xl:text-lg lg:text-base sm:text-sm text-[12px]'>
                            Account
                        </Link>
                    </div>
                    <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                        <div className='flex flex-col gap-1.5 justify-start items-start text-left'>
                            <h5 className='items-start text-left xl:text-xl lg:text-lg sm:text-base text-sm font-medium'>About</h5>
                            <p className='items-start wrap-break-word text-left xl:text-lg lg:text-base sm:text-sm text-[12px]'>
                                A complete production-ready E-commerce web application Project built with Next.js, TypeScript, Tailwind CSS, ShadCN UI, Context API, Node.js, Express, MongoDB, Cloudinary, and Render/Vercel deployment - Project by Safdar Chougle 
                            </p>
                        </div>
                        <div className='flex flex-col gap-1.5 justify-start items-start text-left'>
                            <h5 className='items-start text-left xl:text-xl lg:text-lg sm:text-base text-sm font-medium'>Contact</h5>
                            <p className='items-start wrap-break-word text-left xl:text-lg lg:text-base sm:text-sm text-[12px]'>
                                2810 N Church St PMB 48572, Wilmington, Delaware
                            </p>
                            <p className='items-start wrap-break-word text-left xl:text-lg lg:text-base sm:text-sm text-[12px]'>
                                +911234567890
                            </p>
                            <p className='items-start wrap-break-word text-left xl:text-lg lg:text-base sm:text-sm text-[12px]'>
                                fragrancestore@gmail.in
                            </p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <div className='w-full h-0.5 bg-gray-400 rounded'></div>
                    <div className='flex flex-col items-start justify-start gap-1'>
                        <p className='items-start wrap-break-word text-left font-light xl:text-base lg:text-sm sm:text-[12px] text-[10px]'>&copy;{currentYear} All Rights Resrved, FragranceStore.</p>
                        <p className='items-start wrap-break-word text-left font-light xl:text-base lg:text-sm sm:text-[12px] text-[10px] transition-colors duration-150 ease-linear'>
                            Developed by <Link href={"https://safdarchougle.vercel.app/"} className='hover:underline hover:text-blue-400 hover:cursor-pointer'>Safdar Chougle</Link>
                        </p>
                    </div>
                </div>
            </footer>
        </ScrollWrapper>
    );
};

export default Footer
