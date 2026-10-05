import PublicPageShell from "@/components/PublicPageShell";
import OrderResult from "./components/OrderResult";

type ThankYouScreenProps = { orderNumber?: string; orderId?: string; isDemo?: boolean; isFailed?: boolean };

export default function ThankYouScreen({ orderNumber, orderId, isDemo, isFailed }: ThankYouScreenProps) {
  return (
    <PublicPageShell>
      <section className="flex min-h-[720px] items-center justify-center px-5 pb-24 text-center">
        <OrderResult orderId={orderId} orderNumber={orderNumber} isDemo={isDemo} isFailed={isFailed} />
      </section>
    </PublicPageShell>
  );
}
