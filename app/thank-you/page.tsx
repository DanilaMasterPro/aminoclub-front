import ThankYouScreen from "@/screens/thank-you/ThankYouScreen";

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
