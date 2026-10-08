import { isVideoUrl } from "@/api/media";
import type { CatalogProduct } from "@/api/types";

type ProductMedia = CatalogProduct["images"][number];

/** First photo of the product (cards, cart, previews); videos are skipped. */
export function productPhoto(product: CatalogProduct): ProductMedia | undefined {
  return product.images.find((item) => !isVideoUrl(item.url));
}

/** First video of the product, played on hover in product cards. */
export function productVideo(product: CatalogProduct): ProductMedia | undefined {
  return product.images.find((item) => isVideoUrl(item.url));
}
