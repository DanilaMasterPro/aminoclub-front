import AffiliateScreen from "@/screens/affiliate/AffiliateScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Партнёрская программа — AMINOCLUB",
  description: "Партнёрская программа AMINOCLUB для тренеров и спортивных экспертов.",
};

export default function AffiliatePage() {
  return <AffiliateScreen />;
}
