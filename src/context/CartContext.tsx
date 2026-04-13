import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type CartItem = {
  id: number;
  name: string;
  specs: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCartItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const totalCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}