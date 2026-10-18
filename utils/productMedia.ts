import { isVideoUrl } from "@/api/media";
import type { CatalogProduct } from "@/api/types";

type ProductMedia = CatalogProduct["images"][number];

/** First frame of an uploaded video, saved by the backend next to it (`<name>.poster.webp`). */
export function videoPosterUrl(url: string) {
  return url.replace(/\.(mp4|webm|mov)(?=$|[?#])/i, ".poster.webp");
}

/**
 * Product pictures (cards, cart, previews, structured data); videos are skipped. A product that has
 * only a video gets its poster frame instead.
 */
export function productPhotos(product: CatalogProduct): ProductMedia[] {
  const photos = product.images.filter((item) => !isVideoUrl(item.url));
  if (photos.length) return photos;
  const video = productVideo(product);
  return video ? [{ ...video, url: videoPosterUrl(video.url) }] : [];
}

/** First product picture (see productPhotos). */
export function productPhoto(product: CatalogProduct): ProductMedia | undefined {
  return productPhotos(product)[0];
}

/** First video of the product: played on hover in product cards, scrubbed by scroll on the product page. */
export function productVideo(product: CatalogProduct): ProductMedia | undefined {
  return product.images.find((item) => isVideoUrl(item.url));
}
