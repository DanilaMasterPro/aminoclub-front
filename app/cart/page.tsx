import type { Metadata } from "next";
import CartScreen from "@/screens/cart/CartScreen";

// Service page: not for search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CartPage() { return <CartScreen />; }
