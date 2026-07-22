import Image from "next/image";
import Button from "@/components/Button";

export default function Hero() {
  return (
    <section
      className="relative flex h-[95vh] items-center overflow-hidden rounded-[30px] isolate max-[700px]:block max-[700px]:h-auto max-[700px]:min-h-0 max-[700px]:max-h-none max-[700px]:rounded-[20px] max-[700px]:bg-[#f8f8f8]"
      aria-labelledby="hero-title">
      <Image className="-z-[2] object-cover object-center max-[700px]:hidden" src="/images/hero-v3.png" alt="Протеиновые продукты AMINOCLUB" fill priority sizes="(max-width: 600px) 100vw, 100vw" />
      <div className="relative hidden h-[435px] overflow-hidden max-[700px]:block max-[400px]:h-[400px]">
        <Image className="object-cover object-[center_66%]" src="/images/hero-mobile-v2.png" alt="Протеиновые продукты AMINOCLUB" fill priority sizes="(max-width: 700px) 100vw, 0px" />
      </div>
      <div className="w-[63%] px-[72px] max-[1200px]:px-12 max-[700px]:w-full max-[700px]:p-5 max-[700px]:py-8">
        <p className="mb-[52px] text-xl font-bold tracking-[.18em] text-[#009d0a] uppercase max-[1200px]:mb-9 max-[1200px]:text-base max-[700px]:hidden">Спортивное питание для ежедневного режима</p>
        <h1
          id="hero-title"
          className="m-0 max-w-[900px] text-[78px] leading-[1.08] font-bold tracking-[.015em] uppercase max-[1200px]:text-6xl max-[700px]:mb-7 max-[700px]:max-w-none max-[700px]:border-b max-[700px]:border-[#a1a5a4] max-[700px]:pb-7 max-[700px]:text-[28px] max-[700px]:leading-[1.18] max-[700px]:font-normal max-[700px]:tracking-normal">
          Добавки для силы и восстановления
        </h1>
        <p className="mt-8 max-w-[720px] hidden max-[700px]:block text-[28px] leading-[1.45] text-[#656a6c] max-[1200px]:text-xl max-[700px]:mt-0 max-[700px]:text-sm max-[700px]:leading-[2] max-[700px]:text-[#171b1c] max-[700px]:uppercase">
          Чистые составы, эффективные формулы и честный подход для тех, кто тренируется системно и достигает результата.
        </p>
        <div className="mt-[68px] max-[1200px]:mt-10 max-[700px]:hidden">
          <Button label="СМОТРЕТЬ КАТАЛОГ" variant="outline" href="#catalog" showArrow />
        </div>
        <div className="mt-6 hidden max-[700px]:block">
          <Button label="СМОТРЕТЬ КАТАЛОГ" variant="light" href="#catalog" showArrow />
        </div>
      </div>
    </section>
  );
}
