import ThankYouScreen from "@/screens/thank-you/ThankYouScreen";

const single = (value: string | string[] | undefined) => (typeof value === "string" ? value : undefined);

/** Robokassa FailURL: the customer cancelled the payment or the bank declined it. */
export default async function OrderFailPage({ searchParams }: PageProps<"/order/fail">) {
  const params = await searchParams;
  return <ThankYouScreen orderId={single(params.id) ?? single(params.Shp_order)} isFailed />;
}
