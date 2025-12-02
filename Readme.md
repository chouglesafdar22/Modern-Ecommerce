# Modern E-commerce Store UI

A complete production-ready E-commerce web application built with Next.js, TypeScript, Tailwind CSS, ShadCN UI, Context API, Node.js, Express, MongoDB, Cloudinary, and Render/Vercel deployment.
This project includes everything a real online store needs — authentication, admin dashboard, product management, cart, checkout, orders, invoices, returns system, and much more.

## Features

### Authentication (JWT + Cookies)

 · User Signup & Login

 · Password hashing with bcrypt

 · Forgot & Reset Password

 · JWT stored in HTTP-only cookies

 · Route protection (Frontend & Backend)

 · Admin-role based authentication

### E-Commerce Core Features

 · Fully dynamic product system

 · Product creation, editing, deletion (Admin)

 · Image uploads via Cloudinary

 · Category-based filtering

 · Product brand + price + discount + tax + shipping support

 · SEO-friendly product URLs via slug

### Cart System

 · Add to cart

 · Increase / Decrease quantity

 · Auto updates totals (discount + tax + shipping)

 · Persisted using backend sync

 · Auto-clears after successful order

### Account Page
 
 · Displays user profile info

 · Shows complete order history

 · UI for users with no orders

 · Secure logout

 · Redirect unauthorized users to Login 

### Checkout + Order System

 · Complete checkout page

 · Collect user address + phone

 · COD payment method

 · Order creation

 · Stock updates automatically

 · Order items stored with full pricing breakdown (price, discountPrice, taxPrice, shippingFee, finalPrice)

 · Customer order history

 · Automatic Invoice PDF generation with Cloudinary upload

### Shipping & Delivery Tracking

 · Order Confirmed → Shipped → Delivered flow

 · Admin updates order status

 · User sees real-time updates

 · Expected delivery: 7 days from order date

 · Delivered date recorded

### Returns System

 · User can request return within 3 days after delivery

 · Auto calculation of return pickup date (2 days after request)

 · Admin approves return

 · Stock is auto-restored

 · All timestamps saved:

    · returnRequestedAt

    · returnPickupDate

    · returnCompletedAt

    · returnExpiresAt

### Invoice System (Auto PDF)

 · Invoice auto-generated using PDFKit

 · Uploaded to Cloudinary

 · User & admin can download invoice

 · Currently being improved (stream fix pending)

### User Account Page

 · User profile

 · Order history

 · View order status & invoice

 · Request product return

 · Secure logout

### Admin Dashboard

 · View all orders

 · Update payment / shipping / delivery

 · Approve returns

 · Add/Edit/Delete products

 · Upload product images

 · Protected admin-only routes

### UI & UX Highlights

 · Fully responsive modern UI

 · Tailwind + ShadCN UI components

 · Smooth Framer Motion animations

 · Clean forms

 · Smart error handling

 · Toast notifications

 · Optimized images

 · Mobile-first layouts

## What I Learned

Full-stack authentication (JWT + cookies)

Express + MongoDB backend structure

REST API design

Cloudinary media storage

Handling PDF generation

Next.js App Router

Context API for cart system

Managing admin role & protected routes

Building real E-commerce logic (pricing, stock, orders, returns)

Deploying full-stack apps (Render + Vercel)

## Tech Stack

### Frontend
 
 · Next.js 14 (App Router)

 · React + TypeScript

 · Tailwind CSS

 · ShadCN UI

 · Framer Motion

 · Axios

 · React Hook Form

 · React Toastify

 · Context API

### Backend

 · Node.js

 · Express.js

 · MongoDB + Mongoose

 · Cloudinary (Images + Invoices)

 · Multer (file handling)

 · JSON Web Tokens (JWT)

 · bcryptjs

### Storage

 · MongoDB Atlas

 · Cloudinary (products + invoices)

### Deployment

 · Frontend → Vercel

 · Backend → Render

 · Database → MongoDB Atlas

## How to Run Locally

### Clone the respository
    git clone https://github.com/chouglesafdar22/Modern-Ecommerce.git
    cd Modern-Ecommerce

### Frontend setup
    cd frontend
    npm install
    npm run dev
    
    Then open:
    http://localhost:3000

### backend setup
    cd backend
    npm install
    npm run dev

    Then open:
    http://localhost:3000
