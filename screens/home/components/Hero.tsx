import Image from "next/image";
import Button from "@/components/Button";

export default function Hero() {
  return (
    <section className="relative flex h-[95vh] items-center overflow-hidden rounded-[30px] isolate max-[700px]:h-[95svh] max-[700px]:min-h-[600px] max-[700px]:max-h-[800px] max-[700px]:items-end max-[700px]:rounded-[20px] max-[700px]:bg-[#f6f3ee]" aria-labelledby="hero-title">
      <Image className="-z-[2] object-cover object-center max-[700px]:hidden" src="/images/hero-v3.png" alt="Протеиновые продукты AMINOCLUB" fill priority sizes="(max-width: 600px) 100vw, 100vw" />
      <div className="absolute inset-x-0 top-0 -z-[2] hidden h-[60%] overflow-hidden max-[700px]:block">
        <Image
          className="object-cover object-[center_66%]"
          src="/images/hero-mobile-v2.png"
          alt="Протеиновые продукты AMINOCLUB"
          fill
          priority
          sizes="(max-width: 700px) 100vw, 0px"
        />
      </div>
      <div className="w-[63%] px-[72px] max-[1200px]:px-12 max-[700px]:mb-0 max-[700px]:flex max-[700px]:min-h-[37%] max-[700px]:w-full max-[700px]:flex-col max-[700px]:justify-start max-[700px]:px-6 max-[700px]:pt-5 max-[700px]:pb-6">
        <p className="mb-[52px] text-xl font-bold tracking-[.18em] text-[#009d0a] uppercase max-[1200px]:mb-9 max-[1200px]:text-base max-[700px]:mb-3 max-[700px]:text-[9px] max-[700px]:tracking-[.11em]">
          Спортивное питание для ежедневного режима
        </p>
        <h1 id="hero-title" className="m-0 max-w-[900px] text-[78px] leading-[1.08] font-bold tracking-[.015em] uppercase max-[1200px]:text-6xl max-[700px]:max-w-none max-[700px]:text-[26px] max-[700px]:leading-[1.03] max-[700px]:tracking-normal">
          Добавки для силы и восстановления
        </h1>
        <Button
          className="mt-[68px] px-7 py-2 text-base uppercase max-[1200px]:mt-10 max-[700px]:mt-5 max-[700px]:flex max-[700px]:w-full max-[700px]:justify-between max-[700px]:rounded-[18px] max-[700px]:bg-[#009d0a] max-[700px]:px-6 max-[700px]:py-4 max-[700px]:text-[14px] max-[700px]:text-white"
          label="Смотреть каталог"
          variant="outline"
          href="#catalog"
          showArrow
        />
      </div>
    </section>
  );
}
