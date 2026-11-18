"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/Button";

/** "all" | "necessary". Analytics or marketing scripts, if added later, must load only for "all". */
export const COOKIE_CONSENT_KEY = "aminoclub_cookie_consent_v1";

type CookieChoice = "all" | "necessary";

/** First-visit cookie notice with a link to the policy; the choice is remembered in this browser. */
export default function CookieBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        setIsVisible(!window.localStorage.getItem(COOKIE_CONSENT_KEY));
      } catch {
        setIsVisible(true);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!isVisible || pathname?.startsWith("/admin")) return null;

  const choose = (choice: CookieChoice) => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch {
      // Storage unavailable (private mode): the banner simply reappears on the next visit.
    }
    setIsVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Уведомление о файлах cookie"
      className="fixed bottom-6 left-6 z-[900] w-[520px] rounded-[18px] border border-black/8 bg-[#fcfbf8] p-6 text-[#161a1b] shadow-[0_18px_50px_rgba(21,25,26,0.16)] max-[600px]:right-3 max-[600px]:bottom-3 max-[600px]:left-3 max-[600px]:w-auto max-[600px]:p-5"
    >
      <p className="text-sm leading-6 text-[#4f555b]">
        Мы используем файлы cookie, чтобы сайт работал корректно и запоминал вашу корзину. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием в соответствии с{" "}
        <Link href="/privacy" className="text-[#009d0a] underline-offset-2 hover:underline">Политикой обработки персональных данных</Link>.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 max-[600px]:flex-col">
        <Button label="Принять" onClick={() => choose("all")} className="max-[600px]:w-full" />
        <Button label="Только необходимые" variant="outline" onClick={() => choose("necessary")} className="max-[600px]:w-full" />
      </div>
    </div>
  );
}
