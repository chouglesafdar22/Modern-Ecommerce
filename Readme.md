# Modern E-commerce Store UI

A fully responsive, modern, frontend-only E-commerce web application built using Next.js, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion, and Context API. It simulates a real online shopping experience with auth, products, cart, checkout, orders, and an admin dashboard — all powered through FakeStoreAPI and localStorage for persistence.

## Features

### Authentication(localStorage-base)

 · User Signup with validation

 · Login using stored credentials

 · Forgot Password + Reset Password UI flow

 · Auth state persisted in localStorage

 · Logout functionality

### E-commerce Core Features

 · Fetch products from FakeStoreAPI

 · Dynamic product detail pages

 · Add to cart

 · Update item quantity

 · Remove item

 · Auto price & quantity calculation

 · Search and category filtering

 · Cart stored in localStorage

 · Cart auto-clears after order placement

### Order System

 · Modern checkout page

 · Collect customer details (name/email/address)

 · Select payment option

 · Place Order

 · Save order in localStorage

 · Order history in Account page

### Account Page
 
 · Displays user profile info

 · Shows complete order history

 · UI for users with no orders

 · Secure logout

 · Redirect unauthorized users to Login 

### Admin Dashboard UI

 · Admin login (role stored in localStorage)

 · Admin-only access

 · Product list dashboard

 · (Note: No backend yet — UI simulation only)

### UI & UX Highlights

 · Fully responsive design

 · Built with Tailwind + ShadCN UI

 · Smooth animations using Framer Motion

 · Modern card layouts

 · Clean forms & accessible UI

 · Toast notifications for actions

 · Fast navigation with Next.js App Router

## What I Learned

### This project helped me understand:

Frontend authentication (localStorage logic)

State management with Context API

Fetching & integrating external APIs

Next.js App Router

Component architecture

UI/UX design systems

Building real-world projects

## Tech Stack

### Frontend
 
 · Next.js 14 (App Router)

 · React

 · TypeScript

 · Tailwind CSS

 · ShadCN UI

 · Framer Motion

 · React Hook Form

 · React Toastify

 · Context API

### API
 
 · FakeStoreAPI (Products)

### State Persistence

 · localStorage

### Deployment

 · Vercel

## How to Run Locally
    git clone https://github.com/chouglesafdar22/Modern-Ecommerce.git
    cd Modern-Ecommerce/frontend
    npm install
    npm run dev
    
    Then open:
    http://localhost:3000
