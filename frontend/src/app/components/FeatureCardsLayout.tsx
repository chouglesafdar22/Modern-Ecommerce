import React from 'react';
import FeatureCard from './FeatureCard';
import { PiTruck, PiMoney } from "react-icons/pi";
import { BsTelephone } from "react-icons/bs";
import { SlLock } from "react-icons/sl";

export default function FeaturesCardLayout() {
    return (
        <section className="featuresCardSection xl:px-7 lg:px-5 md:px-3 sm:px-1 px-0.5 pt-8 pb-5">
            <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 justify-center text-center items-center gap-5 rounded-xl bg-gray-100 py-5 px-0.5">
                <FeatureCard icon={<PiTruck />} heading={"Free Shipping"} text={"Order Above $50"} />
                <FeatureCard icon={<PiMoney />} heading={"Money Refund"} text={"2 Days Guarantee"} />
                <FeatureCard icon={<BsTelephone />} heading={"Premium Support"} text={"Phone & Email Support"} />
                <FeatureCard icon={<SlLock />} heading={"Secure Payments"} text={"Secured by Stripe"} />
            </div>
        </section>
    );
};