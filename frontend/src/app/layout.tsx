import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FragranceStore",
  description: "A complete production-ready E-commerce web application built with Next.js, TypeScript, Tailwind CSS, ShadCN UI, Context API, Node.js, Express, MongoDB, Cloudinary, and Render/Vercel deployment.This project includes everything a real online store needs — authentication, admin dashboard, product management, cart, checkout, orders, invoices, returns system, and much more.",
  icons: {
    icon: "/favicom.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
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
        <Analytics />

      </body>
    </html>
  );
}
