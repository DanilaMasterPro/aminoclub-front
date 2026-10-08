import { resolveProductImageUrl } from "@/api/catalog";
import type { CatalogProduct } from "@/api/types";
import JsonLd from "@/components/JsonLd";
import { isVideoUrl } from "@/api/media";
import { siteUrl } from "@/utils/siteUrl";
import { stripHtml } from "@/utils/stripHtml";
import { truncateText } from "@/utils/truncateText";

/** Schema.org Product: lets search engines show price and availability in results. */
export default function ProductJsonLd({ product }: { product: CatalogProduct }) {
  const url = `${siteUrl}/catalog/${product.slug}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${product.title}${product.flavor ? ` ${product.flavor}` : ""}`,
        sku: product.sku,
        description: truncateText(stripHtml(product.description), 500),
        image: product.images.filter((item) => !isVideoUrl(item.url)).map((item) => resolveProductImageUrl(item.url)),
        brand: { "@type": "Brand", name: "AMINOCLUB" },
        category: product.category.title,
        url,
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "RUB",
          price: Number(product.price).toFixed(2),
          availability: product.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      }}
    />
  );
}
