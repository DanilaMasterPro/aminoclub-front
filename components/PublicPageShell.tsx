import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicPageShell({ children, contentClassName = "" }: { children: React.ReactNode; contentClassName?: string }) {
  return (
    <main id="top" className="relative mx-auto my-7 flex w-[min(100%_-_56px,_1920px)] flex-col max-[600px]:my-3 max-[600px]:w-[min(100%_-_24px,_1920px)]">
      <Header homeHref="/" cartHref="/cart" />
      <div className={`pt-[180px] max-[1000px]:pt-[145px] max-[600px]:pt-[105px] ${contentClassName}`}>{children}</div>
      <Footer />
    </main>
  );
}
