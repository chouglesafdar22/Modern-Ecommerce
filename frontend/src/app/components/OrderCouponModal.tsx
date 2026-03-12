"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CouponModalProps {
    isOpen: boolean;
    coupon: {
        code: string;
        discountPercent: number;
        expiresAt: string;
    } | null;
    onClose: () => void;
};

export default function OrderCouponModal({ isOpen, coupon, onClose }: CouponModalProps) {
    return (
        <AnimatePresence>
            {isOpen && coupon && (
                <motion.div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white w-full max-w-xs text-center rounded-xl p-6"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <h3 className="text-xl font-semibold text-green-700">
                            🎉 Congratulations!
                        </h3>
                        <p className="mt-2">
                            You got <b>{coupon.discountPercent}% OFF</b> on next order
                        </p>
                        <div className="mt-3 border rounded p-2 font-mono text-lg">
                            {coupon.code}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Valid till {new Date(coupon.expiresAt).toDateString()}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "decay", duration: 0.3, ease: "easeInOut" }}
                            type="button"
                            onClick={onClose}
                            className={`w-full py-2 px-2 rounded-md font-medium xl:text-lg lg:text-base sm:text-sm text-xs text-white transition bg-black cursor-pointer hover:rounded-lg hover:bg-gray-900`}>
                            Got it
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence >
    )
};