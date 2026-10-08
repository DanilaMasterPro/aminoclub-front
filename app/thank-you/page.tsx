import type { Metadata } from "next";
import ThankYouScreen from "@/screens/thank-you/ThankYouScreen";

// Service page: not for search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ThankYouPage({ searchParams }: PageProps<"/thank-you">) {
  const { order, id, demo } = await searchParams;
  return (
    <ThankYouScreen
      orderNumber={typeof order === "string" ? order : undefined}
      orderId={typeof id === "string" ? id : undefined}
      isDemo={demo === "1"}
    />
  );
}
