import ThankYouScreen from "@/screens/thank-you/ThankYouScreen";

export default async function ThankYouPage({ searchParams }: PageProps<"/thank-you">) {
  const order = (await searchParams).order;
  return <ThankYouScreen orderNumber={typeof order === "string" ? order : undefined} />;
}
