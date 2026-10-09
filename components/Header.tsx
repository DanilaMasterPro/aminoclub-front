import Image from "next/image";
import { resolveMediaUrl } from "@/api/media";
import { getSiteSettings } from "@/api/site-settings";
import HeaderActions from "./HeaderActions";
import StickyHeader from "./StickyHeader";

type HeaderProps = {
  homeHref?: string;
  catalogHref?: string;
  cartHref?: string;
};

export default async function Header({ homeHref = "#top", cartHref = "/cart" }: HeaderProps) {
  const settings = await getSiteSettings();
  const logoUrl = resolveMediaUrl(settings.general.logoUrl || "/icons/logo.svg");

  return (
    <StickyHeader>
      <a className="inline-flex w-[200px] max-[1200px]:w-[170px] max-[600px]:w-[145px] min-[1201px]:group-data-stuck:w-[170px]" href={homeHref} aria-label="AMINOCLUB — главная">
        <Image src={logoUrl} alt="AMINOCLUB" width={192} height={39} priority />
      </a>
      <HeaderActions cartHref={cartHref} logoUrl={logoUrl} menuItems={settings.menus.header} socialLinks={settings.general.socialLinks} />
    </StickyHeader>
  );
}
