"use client"
import Link from "next/link";
import ScrollWrapper from "./components/ScrollWrapper";

export default function not_found() {

    return (
        <ScrollWrapper direction="fade" ease="easeInOut">
            <div className='justify-center h-screen overflow-y-hidden flex flex-col font-serif gap-1.5 items-center text-center px-10 md:px-20 py-10 md:py-20 bg-white text-black mx-auto'>
                <div className="flex md:flex-row flex-col justify-center items-center gap-2 text-center">
                    <h1 className="xl:text-3xl lg:text-2xl sm:text-xl text-lg font-bold">404 </h1>
                    <h2 className="xl:text-2xl lg:text-xl sm:text-lg text-base font-semibold"> page not found!</h2>
                </div>
                <div className="flex justify-center text-center items-center">
                    <p className="xl:text-xl lg:text-lg sm:text-base text-sm font-normal">Go back to <Link href={"/"} className="text-indigo-500 hover:underline hover:text-indigo-900 cursor-pointer">Home</Link> page</p>
                </div>
            </div>
        </ScrollWrapper>
    )
};