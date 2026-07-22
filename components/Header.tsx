import Image from "next/image";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 z-[2] flex w-full items-center justify-between p-[clamp(24px,3vw,58px)] max-[600px]:p-[18px]">
      <a className="inline-flex w-[clamp(145px,12.5vw,200px)]" href="#top" aria-label="AMINOCLUB — главная">
        <Image src="/icons/logo.svg" alt="AMINOCLUB" width={192} height={39} priority />
      </a>
      <nav className="flex gap-3" aria-label="Основная навигация">
        <a className="grid size-14 place-items-center rounded-full bg-white/95 max-[600px]:size-[46px]" href="#catalog" aria-label="Корзина">
          <svg aria-hidden="true" className="size-[25px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 8h12l1 12H5L6 8Z" strokeLinejoin="round" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
          </svg>
        </a>
        <button className="grid size-14 content-center place-items-center gap-[5px] rounded-full border-0 bg-white/95 max-[600px]:size-[46px]" type="button" aria-label="Открыть меню">
          <span className="block h-0.5 w-6 bg-[#161a1a]" />
          <span className="block h-0.5 w-6 bg-[#161a1a]" />
          <span className="block h-0.5 w-6 bg-[#161a1a]" />
        </button>
      </nav>
    </header>
  );
}
