import Image from "next/image";
import Button from "@/components/Button";
import { resolveProductImageUrl } from "@/api/catalog";
import type { CatalogProduct } from "@/api/types";

type ProductCardProps = {
  product: CatalogProduct;
  animationDelay?: number;
};

export default function ProductCard({ product, animationDelay = 0 }: ProductCardProps) {
  const image = product.images[0];

  return (
    <article data-testid="catalog-product" data-fade-up data-fade-up-delay={animationDelay} className="flex h-full min-w-0 flex-col rounded-[22px] bg-[#fcfbf8] p-5">
      <div className="relative aspect-[390/274] overflow-hidden rounded-[15px] bg-[#f2f4ef]">
        {image ? (
          <Image className="object-cover" src={resolveProductImageUrl(image.url)} alt={image.alt || `${product.title}, вкус ${product.flavor || "не указан"}`} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 25vw" />
        ) : (
          <span className="flex h-full items-center justify-center px-5 text-center text-sm text-[#7a7f81]">Изображение скоро появится</span>
        )}
      </div>
      <h2 className="mt-[25px] mb-[14px] text-[21px] font-medium">{product.title}</h2>
      <p className="min-h-[54px] text-sm leading-[1.4] text-[#5b6165] max-[600px]:min-h-0">{product.shortDescription || product.description}</p>
      <strong className="my-6 text-[23px]">{Number(product.price).toLocaleString("ru-RU")} ₽</strong>
      <div className="flex items-center gap-3.5">
        <Button className="w-[235px] shrink-0 px-3.5 text-[15px] max-[1280px]:min-w-[130px] max-[1280px]:flex-1 max-[1280px]:w-auto" label="В корзину" icon="cart" />
        <span className="flex items-center gap-[7px] text-xs leading-[1.15] text-[#202425]">
          <Image src="/icons/clock.svg" alt="" width={25} height={25} />
          Доставка от<br />2–3 дня
        </span>
      </div>
    </article>
  );
}
