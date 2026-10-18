import Button from "@/components/Button";

export default function About() {
  return (
    <section className="grid grid-cols-2 overflow-hidden rounded-[24px] bg-[#f8f8f8] max-[850px]:grid-cols-1" aria-labelledby="about-title">
      <div data-fade-up className="min-h-[844px] bg-[url('/images/about.png')] bg-cover bg-center max-[1200px]:min-h-[620px] max-[850px]:min-h-[400px]" />
      <div data-fade-up className="flex flex-col justify-center p-[100px] max-[1200px]:p-16 max-[850px]:p-10 max-[700px]:p-5 max-[700px]:py-8">
        <h2 id="about-title" className="mb-[50px] border-b border-[#a1a5a4] pb-[50px] text-[42px] leading-[1.18] font-normal uppercase max-[850px]:mb-7 max-[850px]:pb-7 max-[850px]:text-[28px]">AMINOCLUB — спортивное питание <br className="max-[850px]:hidden" />для твоих целей</h2>
        <div className="max-w-[600px] space-y-6 text-xl leading-[2] uppercase max-[850px]:space-y-4 max-[850px]:text-sm">
          <p>Помогаем становиться сильнее, повышать выносливость и достигать новых результатов.</p>
          <p>В AMINOCLUB ты найдёшь спортивное питание для набора мышечной массы, восстановления после тренировок и поддержания активного образа жизни.</p>
          <p>Мы уделяем особое внимание качеству продукции, прозрачности состава и безопасности. Выбирай спортивное питание с уверенностью и двигайся к своим целям вместе с AMINOCLUB.</p>
        </div>
        <Button className="mt-12 self-start uppercase shadow-[0_3px_15px_rgba(0,0,0,.04)] max-[700px]:mt-6" label="Смотреть каталог" variant="light" href="#catalog" showArrow />
      </div>
    </section>
  );
}
