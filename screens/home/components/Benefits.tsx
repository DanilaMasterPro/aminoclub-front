import Image from "next/image";

const benefits = [
  ["atom.svg", "Чистый состав", "Без лишних добавок и сложных формул."],
  ["hand-and-coins.svg", "Это база!", "Все нужное для спортсменов и регулярных тренировок."],
  ["delivery.svg", "Доставка СДЭК", "Отправляем заказы по всей России"],
  ["banana.svg", "Вкусы на выбор", "Классика, фрукты и ягодные варианты"],
  ["blocks.svg", "Товары в наличии", "На сайте только доступные позиции"],
  ["tablet.svg", "Без регистрации", "Оформление заказа без лишних заморочек"],
  ["rock.svg", "Оплата при получении", "Оплачивайте товар только при получении"],
  ["protection.svg", "Сертификация", "Наша продукция соответствует ГОСТ"],
];

export default function Benefits() {
  return <section className="my-[120px] grid grid-cols-4 gap-x-[38px] gap-y-[68px] px-[3%] max-[1200px]:my-24 max-[1050px]:grid-cols-2 max-[600px]:my-[72px] max-[600px]:grid-cols-1 max-[600px]:gap-8" aria-label="Преимущества AMINOCLUB">{benefits.map(([icon, title, text]) => <article className="flex items-center gap-5" key={title}><span className="grid size-20 shrink-0 place-items-center rounded-full bg-[#009d0a] max-[600px]:size-16"><Image src={`/icons/benefits/${icon}`} alt="" width={43} height={43} /></span><div><h2 className="mb-[7px] text-lg font-medium">{title}</h2><p className="text-sm leading-[1.35] text-[#656a6c]">{text}</p></div></article>)}</section>;
}
