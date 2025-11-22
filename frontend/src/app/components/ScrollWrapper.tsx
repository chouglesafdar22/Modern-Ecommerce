"use client";
import React from "react";
import { motion } from "framer-motion";

interface ScrollWrapperProps {
    children: React.ReactNode;
    direction?: "up" | "down" | "left" | "right" | "fade";
    delay?: number;
    ease?: "easeInOut" | "easeIn" | "easeOut" | "linear" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut" | "anticipate";
}

export default function ScrollWrapper({
    children,
    direction = "up",
    delay = 0,
    ease = "easeInOut",
}: ScrollWrapperProps) {
    // Initial animation position
    let initial: any = { opacity: 0 };

    switch (direction) {
        case "left":
            initial.x = -100;
            break;
        case "right":
            initial.x = 100;
            break;
        case "up":
            initial.y = -60;
            break;
        case "down":
            initial.y = 60;
            break;
        case "fade":
            initial = { opacity: 0 };
            break;
        default:
            break;
    }

    return (
        <motion.div
            initial={initial}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay, ease }}
        >
            {children}
        </motion.div>
    );
}
