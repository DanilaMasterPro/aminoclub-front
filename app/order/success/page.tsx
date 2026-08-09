import ThankYouScreen from "@/screens/thank-you/ThankYouScreen";

export default async function OrderSuccessPage({ searchParams }: PageProps<"/order/success">) {
  const order = (await searchParams).order;
  return <ThankYouScreen orderNumber={typeof order === "string" ? order : undefined} />;
}
