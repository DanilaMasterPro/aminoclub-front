"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Lightbox from "@/components/Lightbox";
import { isPdfUrl, resolveMediaUrl } from "@/api/media";
import type { CatalogProduct } from "@/api/types";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import { parseCharacteristics } from "@/utils/stripHtml";

export default function ProductDetails({ product }: { product: CatalogProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [certificateIndex, setCertificateIndex] = useState<number | null>(null);
  const certificates = product.certificates ?? [];
  // Images open in the lightbox; PDFs open in a new tab.
  const certificateImages = certificates.filter((item) => !isPdfUrl(item.fileUrl));
  const { addItem } = useCart();
  const characteristics = parseCharacteristics(product.characteristics);
  return (
    <div className="pt-7 max-[1000px]:pt-0">
      <h1 className="border-b border-black/35 pb-7 font-[family-name:var(--font-helvetica-neue)] text-[64px] leading-[0.95] font-normal tracking-[-0.045em] max-[1300px]:text-[52px] max-[600px]:text-[40px]">{product.title}{product.flavor ? ` ${product.flavor}` : ""}</h1>
      <p className="mt-6 text-[22px] text-[#aeb0ae]">{formatPrice(product.price)}</p>
      <div data-testid="product-purchase" className="mt-12 flex items-center gap-4 max-[600px]:mt-8">
        <div className="flex h-12 items-center rounded-full bg-white px-1"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-10">−</button><span className="w-8 text-center">{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} className="size-10">+</button></div>
        <Button onClick={() => addItem(product, quantity)} className="w-[340px] max-[600px]:flex-1" label="В корзину" icon="cart" />
      </div>
      <section className="mt-12">
        <h2 className="border-b border-black/35 pb-4 text-sm font-medium">Описание</h2>
        {/* The description is sanitized on the backend before it is saved. */}
        <div
          className="whitespace-pre-line py-8 text-sm leading-7 text-[#6b706f] [&_li]:mt-1 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
        <dl className="grid max-w-[620px] grid-cols-[minmax(140px,2fr)_3fr] border border-black/30 text-sm [&>dd]:border-l [&>dd]:border-black/30 [&>dd]:p-5 [&>dt]:p-5 [&>*:nth-child(n+3)]:border-t [&>*:nth-child(n+3)]:border-black/30">
          <dt>Вкус</dt><dd>{product.flavor || "Без вкуса"}</dd>
          {characteristics.map((row) => (
            <Fragment key={row.name}><dt>{row.name}</dt><dd>{row.value}</dd></Fragment>
          ))}
        </dl>
      </section>
      {certificates.length > 0 && (
        <section className="mt-12" aria-labelledby="product-certificates-title">
          <h2 id="product-certificates-title" className="border-b border-black/35 pb-4 text-sm font-medium">Сертификаты качества</h2>
          <div className="mt-6 grid grid-cols-4 gap-3 max-[600px]:grid-cols-3">
            {certificates.map((certificate) => isPdfUrl(certificate.fileUrl) ? (
              <a key={certificate.id} href={resolveMediaUrl(certificate.fileUrl)} target="_blank" rel="noreferrer" className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-lg bg-white p-3 text-center text-xs text-[#5b6165] transition hover:text-[#009d0a]">
                <span className="text-lg font-semibold text-[#009d0a]">PDF</span>
                <span className="line-clamp-3">{certificate.title}</span>
              </a>
            ) : (
              <button
                key={certificate.id}
                type="button"
                onClick={() => setCertificateIndex(certificateImages.indexOf(certificate))}
                aria-label={`Открыть: ${certificate.title}`}
                className="relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-lg bg-white transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,.08)]"
              >
                <Image src={resolveMediaUrl(certificate.fileUrl)} alt={certificate.title} fill sizes="160px" className="object-contain p-2" />
              </button>
            ))}
          </div>
          <Lightbox items={certificateImages.map((item) => ({ url: item.fileUrl, caption: item.title }))} index={certificateIndex} onIndexChange={setCertificateIndex} />
        </section>
      )}
      <div className="mt-12 rounded-xl bg-[#009d0a] px-5 py-4 text-xs text-white">ⓘ &nbsp; Доставка в течение 2–5 дней.</div>
    </div>
  );
}
