import Image from "next/image";
import { resolveMediaUrl } from "@/api/media";
import { getSiteSettings } from "@/api/site-settings";
import HeaderActions from "./HeaderActions";

type HeaderProps = {
  homeHref?: string;
  catalogHref?: string;
};

export default async function Header({ homeHref = "#top", catalogHref = "#catalog" }: HeaderProps) {
  const settings = await getSiteSettings();
  const logoUrl = resolveMediaUrl(settings.general.logoUrl || "/icons/logo.svg");

  return (
    <header data-fade-up className="absolute top-0 left-0 z-[2] flex w-full items-center justify-between p-[58px] max-[1200px]:p-10 max-[600px]:p-[18px]">
      <a className="inline-flex w-[200px] max-[1200px]:w-[170px] max-[600px]:w-[145px]" href={homeHref} aria-label="AMINOCLUB — главная">
        <Image src={logoUrl} alt="AMINOCLUB" width={192} height={39} priority />
      </a>
      <HeaderActions catalogHref={catalogHref} menuItems={settings.menus.header} />
    </header>
  );
}
