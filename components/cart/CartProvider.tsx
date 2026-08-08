"use client";

import { useEffect, useMemo, useState } from "react";
import { CartContext, type CartItem } from "./CartContext";

const STORAGE_KEY = "aminoclub_cart_v1";

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) setItems(JSON.parse(stored) as CartItem[]);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isReady) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [isReady, items]);

  const value = useMemo(() => ({
    items,
    isReady,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    addItem(product: CartItem["product"], quantity = 1) {
      setItems((current) => {
        const existing = current.find((item) => item.product.id === product.id);
        if (!existing) return [...current, { product, quantity: Math.max(1, quantity) }];
        return current.map((item) => item.product.id === product.id
          ? { ...item, quantity: Math.min(product.stockQuantity, item.quantity + quantity) }
          : item);
      });
    },
    removeItem(productId: string) {
      setItems((current) => current.filter((item) => item.product.id !== productId));
    },
    setQuantity(productId: string, quantity: number) {
      setItems((current) => current.map((item) => item.product.id === productId
        ? { ...item, quantity: Math.max(1, Math.min(item.product.stockQuantity, quantity)) }
        : item));
    },
    clearCart() { setItems([]); },
  }), [isReady, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
