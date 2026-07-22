export default function CallToAction() {
  return (
    <section
      className="relative flex min-h-[620px] items-center overflow-hidden rounded-[30px] bg-[url('/images/CAT.png')] bg-cover bg-center max-[1200px]:min-h-[500px] max-[650px]:min-h-[390px] max-[650px]:items-end max-[650px]:rounded-[20px] max-[650px]:bg-[position:65%_center]"
      aria-labelledby="cta-title"
    >
      <div className="ml-[160px] w-[min(100%_-_48px,640px)] max-[1200px]:ml-20 max-[650px]:ml-0 max-[650px]:w-full max-[650px]:bg-gradient-to-t max-[650px]:from-white/90 max-[650px]:to-transparent max-[650px]:px-6 max-[650px]:pt-[110px] max-[650px]:pb-9">
        <h2
          id="cta-title"
          className="mb-9 text-[62px] leading-[1.17] font-normal uppercase max-[850px]:text-4xl"
        >
          Поддержите прогресс
          <br />
          там, где он строится
        </h2>
        <p className="max-w-[610px] text-[28px] leading-[1.45] max-[850px]:text-lg">
          Тренировки дают нагрузку. А правильные добавки помогают
          восстановиться, держать режим и двигаться дальше
        </p>
      </div>
    </section>
  );
}
