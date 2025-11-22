import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modern E-commerce Store UI",
  description: "A fully functional, responsive, frontend-only E-commerce web application built with Next.js, React, Tailwind CSS, and localStorage for authentication, cart management, and orders.This project simulates a real shopping experience — including signup/login, cart operations, checkout flow, order history, search & filtering, and a basic admin dashboard UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=TASA+Orbiter:wght@400..800&display=swap" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased xl:px-2.5 lg:px-2 md:px-1.5 sm:px-1 px-0.5 xl:py-2.5 lg:py-2 md:py-1.5 sm:py-1 py-0.5 font-sans justify-center items-center`}
      >
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
