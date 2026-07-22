import Image from "next/image";
import Button from "@/components/Button";

export default function Hero() {
  return (
    <section
      className="relative flex h-[95vh] items-center overflow-hidden rounded-[30px] isolate max-[700px]:h-[95svh] max-[700px]:items-end max-[700px]:rounded-[20px]"
      aria-labelledby="hero-title"
    >
      <Image
        className="-z-[2] object-cover object-center max-[700px]:hidden"
        src="/images/hero.png"
        alt="Протеиновые продукты AMINOCLUB"
        fill
        priority
        sizes="(max-width: 600px) 100vw, 100vw"
      />
      <Image
        className="-z-[2] hidden object-cover object-center max-[700px]:block"
        src="/images/hero-mobile-v2.png"
        alt="Протеиновые продукты AMINOCLUB"
        fill
        priority
        sizes="(max-width: 700px) 100vw, 0px"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-[1] hidden h-[48%] bg-gradient-to-t from-[#f6f3ee]/95 via-[#f6f3ee]/65 to-transparent max-[700px]:block" />
      <div className="w-[63%] px-[clamp(34px,4vw,72px)] max-[700px]:mb-0 max-[700px]:w-full max-[700px]:px-6 max-[700px]:pb-6">
        <p className="mb-[clamp(24px,3vw,52px)] text-[clamp(11px,1.1vw,20px)] font-semibold tracking-[.18em] text-[#009d0a] uppercase max-[700px]:mb-4 max-[700px]:text-[10px] max-[700px]:tracking-[.14em]">
          Спортивное питание для ежедневного режима
        </p>
        <h1
          id="hero-title"
          className="m-0 text-[clamp(36px,4.1vw,78px)] leading-[1.08] font-bold tracking-[.015em] uppercase max-[700px]:text-[clamp(32px,9vw,48px)] max-[700px]:leading-[1.02]"
        >
          Добавки для силы
          <br />и восстановления
        </h1>
        <Button
          className="mt-[clamp(28px,3.6vw,68px)] px-7 py-2 text-[clamp(12px,1vw,17px)] uppercase max-[700px]:mt-7 max-[700px]:flex max-[700px]:w-full max-[700px]:justify-between max-[700px]:rounded-[18px] max-[700px]:bg-[#009d0a] max-[700px]:px-6 max-[700px]:py-4 max-[700px]:text-[15px] max-[700px]:text-white"
          variant="outline"
          href="#catalog"
        >
          Смотреть каталог{" "}
          <span
            className="grid size-12 place-items-center rounded-full bg-[#009d0a] text-[25px] text-white max-[700px]:size-auto max-[700px]:bg-transparent"
            aria-hidden="true"
          >
            ↗
          </span>
        </Button>
      </div>
    </section>
  );
}
