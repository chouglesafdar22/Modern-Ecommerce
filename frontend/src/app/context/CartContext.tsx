"use client";
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

export interface Product {
    id: string | number;
    title: string;
    price: number;
    image: string;
};

export interface CartItem extends Product {
    quantity: number;
};

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    updateQuantity: (id: string | number, quantity: number) => void;
    removeFromCart: (id: string | number) => void;
    clearCart: () => void;
    totalCartItems: number;
    totalCartPrices: number;
};

interface CartProviderProps {
    children: ReactNode;
};


const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: CartProviderProps) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // load cartItems from localStorage
    useEffect(() => {
        try {
            const loadItems = localStorage.getItem("cart");
            if (loadItems) setCart(JSON.parse(loadItems));
        } catch (error: any) {
            console.warn(error.message);
        }
    }, []);

    // save cardItems to localStorage
    useEffect(() => {
        try {
            localStorage.setItem("cart", JSON.stringify(cart));
        } catch (error: any) {
            console.error(error.message);
        }
    }, [cart]);

    // add cart items
    const addToCart = (product: Product, quantity: number = 1) => {
        setCart((prev) => {
            const existingCartItem = prev.find((item) => item.id === product.id);
            if (existingCartItem) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            };
            return [...prev, { ...product, quantity }];
        });
    };

    // update quantity
    const updateQuantity = (id: string | number, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    };

    // remove cart items
    const removeFromCart = (id: string | number) => {
        setCart((prev) => prev.filter((item) => item.id !== id))
    };

    // clear cart
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    // total cart items
    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // total cart prices
    const totalCartPrices = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                totalCartItems,
                totalCartPrices
            }}
        >
            {children}
        </CartContext.Provider>
    )
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context)
        throw new Error("useCart must be used inside <CartProvider>");
    return context;
}