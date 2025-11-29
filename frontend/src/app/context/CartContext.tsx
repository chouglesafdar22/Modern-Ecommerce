"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import api from "@/app/utils/axios";
import { toast } from "react-toastify";

interface CartItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        image: string;
        price: number;
        discountPrice: number;
    };
    qty: number;
    price: number;
}

interface CartContextType {
    cart: CartItem[];
    totalItems: number;
    totalPrice: number;
    addToCart: (productId: string, qty?: number) => Promise<void>;
    updateQuantity: (productId: string, qty: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Calculate totals
    const calculateTotals = (items: CartItem[]) => {
        const itemsCount = items.reduce((acc, i) => acc + i.qty, 0);
        const priceTotal = items.reduce(
            (acc, i) => acc + i.qty * i.price,
            0
        );

        setTotalItems(itemsCount);
        setTotalPrice(priceTotal);
    };

    // Load cart from backend
    const fetchCart = async () => {
        try {
            const res = await api.get("/carts");
            const cartData = res.data;

            setCart(cartData.items);
            calculateTotals(cartData.items);
        } catch {
            console.log("Cart load error");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Add to cart
    const addToCart = async (productId: string, qty: number = 1) => {
        try {
            const res = await api.post("/carts/add", { productId, qty });
            const cartData = res.data;

            setCart(cartData.items);
            calculateTotals(cartData.items);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add to cart");
        }
    };

    // Update quantity
    const updateQuantity = async (productId: string, qty: number) => {
        try {
            const res = await api.put("/carts/update", { productId, qty });
            const cartData = res.data;

            setCart(cartData.items);
            calculateTotals(cartData.items);

        } catch {
            toast.error("Failed to update quantity");
        }
    };

    // Remove item
    const removeFromCart = async (productId: string) => {
        try {
            const res = await api.delete(`/carts/remove/${productId}`);
            const cartData = res.data;

            setCart(cartData.items);
            calculateTotals(cartData.items);
        } catch {
            toast.error("Failed to remove item");
        }
    };

    // Clear cart
    const clearCart = async () => {
        try {
            await api.delete("/carts/clear");

            setCart([]);
            setTotalItems(0);
            setTotalPrice(0);
        } catch {
            toast.error("Failed to clear cart");
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                totalItems,
                totalPrice,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside <CartProvider>");
    return context;
};
