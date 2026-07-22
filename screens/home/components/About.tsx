import Button from "@/components/Button";

export default function About() {
  return (
    <section className="grid grid-cols-2 overflow-hidden rounded-[24px] bg-[#f8f8f8] max-[850px]:grid-cols-1" aria-labelledby="about-title">
      <div className="min-h-[clamp(450px,45vw,844px)] bg-[url('/images/about.png')] bg-cover bg-center max-[850px]:min-h-[400px]" />
      <div className="flex flex-col justify-center p-[clamp(38px,5.2vw,100px)]">
        <h2 id="about-title" className="mb-[50px] border-b border-[#a1a5a4] pb-[50px] text-[clamp(28px,2.15vw,42px)] leading-[1.18] font-normal uppercase max-[850px]:mb-7 max-[850px]:pb-7">AMINOCLUB — комплексное<br />спортивное питание</h2>
        <p className="max-w-[600px] text-[clamp(14px,1.15vw,20px)] leading-[2] uppercase">Мы делаем качественное спортивное питание с добавлением СРГ для тех, кто тренируется системно и достигает результата. Мы контролируем состав, фасовку и готовую упаковку, а продукция проходит необходимую сертификацию. Покупатель видит все ключевые данные до заказа: состав, дозировку, вес и срок годности.</p>
        <Button className="mt-12 self-start px-7 py-2 uppercase shadow-[0_3px_15px_rgba(0,0,0,.04)]" variant="light" href="#catalog">Смотреть каталог <span className="grid size-[42px] place-items-center rounded-full bg-[#009d0a] text-[21px] text-white" aria-hidden="true">↗</span></Button>
      </div>
    </section>
  );
}
