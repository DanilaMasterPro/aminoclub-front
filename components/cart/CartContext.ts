import { createContext } from "react";
import type { CatalogProduct } from "@/api/types";

export type CartItem = { product: CatalogProduct; quantity: number };

export type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isReady: boolean;
  addItem: (product: CatalogProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);
