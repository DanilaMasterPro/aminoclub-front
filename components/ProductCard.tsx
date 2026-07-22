import Image from "next/image";
import Button from "@/components/Button";
import type { Product } from "@/mock/products";

type ProductCardProps = {
  product: Product;
  animationDelay?: number;
};

export default function ProductCard({ product, animationDelay = 0 }: ProductCardProps) {
  return (
    <article data-fade-up data-fade-up-delay={animationDelay} className="flex h-full min-w-0 flex-col rounded-[22px] bg-[#fcfbf8] p-5">
      <div className="relative aspect-[390/274] overflow-hidden rounded-[15px] bg-[#f2f4ef]">
        <Image className="object-cover" src={product.image} alt={`${product.name}, вкус ${product.flavour}`} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 25vw" />
      </div>
      <h2 className="mt-[25px] mb-[14px] text-[21px] font-medium">{product.name}</h2>
      <p className="min-h-[54px] text-sm leading-[1.4] text-[#5b6165] max-[600px]:min-h-0">{product.description}</p>
      <strong className="my-6 text-[23px]">{product.price.toLocaleString("ru-RU")} ₽</strong>
      <div className="flex items-center gap-3.5">
        <Button className="w-[235px] shrink-0 px-3.5 text-[15px] max-[1280px]:min-w-[130px] max-[1280px]:flex-1 max-[1280px]:w-auto" label="В корзину" icon="cart" />
        <span className="flex items-center gap-[7px] text-xs leading-[1.15] text-[#202425]">
          <Image src="/icons/clock.svg" alt="" width={25} height={25} />
          Доставка от<br />{product.delivery}
        </span>
      </div>
    </article>
  );
}
