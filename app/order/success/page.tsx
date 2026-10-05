import ThankYouScreen from "@/screens/thank-you/ThankYouScreen";

const single = (value: string | string[] | undefined) => (typeof value === "string" ? value : undefined);

/** Robokassa SuccessURL: adds OutSum, InvId, SignatureValue and our Shp_order (order id) to the query. */
export default async function OrderSuccessPage({ searchParams }: PageProps<"/order/success">) {
  const params = await searchParams;
  return (
    <ThankYouScreen
      orderNumber={single(params.order)}
      orderId={single(params.id) ?? single(params.Shp_order)}
      isDemo={params.demo === "1"}
    />
  );
}
