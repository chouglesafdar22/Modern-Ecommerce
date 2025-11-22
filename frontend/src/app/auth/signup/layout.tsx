import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Sign Up Page",
    description: "This is Sign Up page of FragranceStore for User",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased xl:px-2.5 lg:px-2 md:px-1.5 sm:px-1 px-0.5 xl:py-2.5 lg:py-2 md:py-1.5 sm:py-1 py-0.5 font-sans justify-center items-center`}
        >
            {children}
        </div>
    );
}