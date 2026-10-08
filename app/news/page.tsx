import type { Metadata } from "next";
import NewsScreen from "@/screens/news/NewsScreen";

export const metadata: Metadata = {
  title: "Блог — AMINOCLUB",
  description: "Статьи AMINOCLUB о спортивном питании, тренировках и восстановлении.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() { return <NewsScreen />; }
