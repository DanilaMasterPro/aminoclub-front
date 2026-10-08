import Image from "next/image";
import Button from "@/components/Button";

export default function Hero() {
  return (
    // Desktop: height is capped at width/1.9 and the photo is pinned right (only the empty wall is cropped),
    // so the jars always start at ≥47.5% of the hero width; the text column takes 44%.
    // Up to 900px the stacked mobile layout is used: there is no room for the text next to the jars.
    <section
      className="relative flex aspect-[1.9/1] max-h-[95vh] w-full items-center overflow-hidden rounded-[30px] isolate max-[900px]:block max-[900px]:h-auto max-[900px]:aspect-auto max-[900px]:min-h-0 max-[900px]:max-h-none max-[900px]:rounded-[20px] max-[900px]:bg-[#f8f8f8]"
      aria-labelledby="hero-title">
      <Image className="-z-[2] object-cover object-right max-[900px]:hidden" src="/images/hero-v4.png" alt="Протеиновые продукты AMINOCLUB" fill priority sizes="(max-width: 600px) 100vw, 100vw" />
      <div className="relative hidden h-[435px] overflow-hidden max-[900px]:block max-[400px]:h-[400px]">
        <Image className="object-cover object-[center_66%]" src="/images/hero-mobile-v2.png" alt="Протеиновые продукты AMINOCLUB" fill priority sizes="(max-width: 900px) 100vw, 0px" />
      </div>
      <div data-fade-up className="w-[44%] px-[58px] max-[1200px]:px-10 max-[900px]:w-full max-[900px]:px-[18px] max-[900px]:py-8">
        <p className="mb-[52px] text-xl font-bold tracking-[.18em] text-[#009d0a] uppercase max-[1200px]:mb-9 max-[1200px]:text-base max-[900px]:hidden">Спортивное питание для ежедневного режима</p>
        <h1
          id="hero-title"
          className="m-0 max-w-[900px] text-[2.8vw] min-[1976px]:text-[55px] leading-[1.08] font-bold tracking-[.015em] uppercase max-[900px]:mb-7 max-[900px]:max-w-none max-[900px]:border-b max-[900px]:border-[#a1a5a4] max-[900px]:pb-7 max-[900px]:text-[28px] max-[900px]:leading-[1.18] max-[900px]:font-normal max-[900px]:tracking-normal">
          Добавки для силы и восстановления
        </h1>
        <p className="mt-8 max-w-[720px] hidden max-[900px]:block text-[28px] leading-[1.45] text-[#656a6c] max-[1200px]:text-xl max-[900px]:mt-0 max-[900px]:text-sm max-[900px]:leading-[2] max-[900px]:text-[#171b1c] max-[900px]:uppercase">
          Чистые составы, эффективные формулы и честный подход для тех, кто тренируется системно и достигает результата.
        </p>
        <div className="mt-[68px] max-[1200px]:mt-10 max-[900px]:hidden">
          <Button label="СМОТРЕТЬ КАТАЛОГ" variant="outline" href="/catalog" showArrow />
        </div>
        <div className="mt-6 hidden max-[900px]:block">
          <Button label="СМОТРЕТЬ КАТАЛОГ" variant="light" href="/catalog" showArrow />
        </div>
      </div>
    </section>
  );
}
