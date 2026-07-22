import Image from "next/image";

export default function CallToAction() {
  return (
    <section
      className="relative flex min-h-[620px] items-center overflow-hidden rounded-[30px] bg-[url('/images/CAT.png')] bg-cover bg-center max-[1200px]:min-h-[500px] max-[650px]:block max-[650px]:min-h-0 max-[650px]:rounded-[20px] max-[650px]:bg-none"
      aria-labelledby="cta-title">
      <div data-fade-up className="relative hidden aspect-square overflow-hidden max-[650px]:block">
        <Image className="object-cover object-center" src="/images/cta-mobile-v2.png" alt="Спортсмен тренируется с гантелями" fill sizes="(max-width: 650px) 100vw, 0px" />
      </div>
      <div data-fade-up className="ml-[160px] w-[min(100%_-_48px,1000px)] max-[1200px]:ml-20 max-[650px]:ml-0 max-[650px]:w-full max-[650px]:bg-[#f8f8f8] max-[650px]:p-5 max-[650px]:py-8">
        <h2 id="cta-title" className="mb-9 max-w-[900px] text-[62px] leading-[1.17] font-normal uppercase max-[850px]:text-4xl max-[650px]:mb-7 max-[650px]:max-w-none max-[650px]:border-b max-[650px]:border-[#a1a5a4] max-[650px]:pb-7 max-[650px]:text-[28px] max-[650px]:leading-[1.18]">
          Поддержите прогресс там, где он строится
        </h2>
        <p className="max-w-[610px] text-[28px] leading-[1.45] max-[850px]:text-lg max-[650px]:max-w-none max-[650px]:text-sm max-[650px]:leading-[2] max-[650px]:uppercase">Тренировки дают нагрузку. А правильные добавки помогают восстановиться, держать режим и двигаться дальше</p>
      </div>
    </section>
  );
}
