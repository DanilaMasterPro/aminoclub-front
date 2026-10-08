import type { Metadata } from "next";
import CheckoutScreen from "@/screens/checkout/CheckoutScreen";

// Service page: not for search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CheckoutPage() { return <CheckoutScreen />; }
