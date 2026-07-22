import Button from "@/components/Button";

export default function About() {
  return (
    <section className="grid grid-cols-2 overflow-hidden rounded-[24px] bg-[#f8f8f8] max-[850px]:grid-cols-1" aria-labelledby="about-title">
      <div data-fade-up className="min-h-[844px] bg-[url('/images/about.png')] bg-cover bg-center max-[1200px]:min-h-[620px] max-[850px]:min-h-[400px]" />
      <div data-fade-up className="flex flex-col justify-center p-[100px] max-[1200px]:p-16 max-[850px]:p-10 max-[700px]:p-5 max-[700px]:py-8">
        <h2 id="about-title" className="mb-[50px] border-b border-[#a1a5a4] pb-[50px] text-[42px] leading-[1.18] font-normal uppercase max-[850px]:mb-7 max-[850px]:pb-7 max-[850px]:text-[28px]">AMINOCLUB — комплексное<br />спортивное питание</h2>
        <p className="max-w-[600px] text-xl leading-[2] uppercase max-[850px]:text-sm">Мы делаем качественное спортивное питание с добавлением СРГ для тех, кто тренируется системно и достигает результата. Мы контролируем состав, фасовку и готовую упаковку, а продукция проходит необходимую сертификацию. Покупатель видит все ключевые данные до заказа: состав, дозировку, вес и срок годности.</p>
        <Button className="mt-12 self-start uppercase shadow-[0_3px_15px_rgba(0,0,0,.04)] max-[700px]:mt-6" label="Смотреть каталог" variant="light" href="#catalog" showArrow />
      </div>
    </section>
  );
}
