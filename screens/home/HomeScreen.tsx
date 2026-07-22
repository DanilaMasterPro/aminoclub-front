import Footer from "@/components/Footer";
import Header from "@/components/Header";
import About from "./components/About";
import Benefits from "./components/Benefits";
import CallToAction from "./components/CallToAction";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Testimonials from "./components/Testimonials";

export default function HomeScreen() {
  return (
    <main id="top" className="mx-auto my-7 flex w-[min(100%_-_56px,_1920px)] flex-col gap-[clamp(72px,6.25vw,120px)] max-[600px]:my-3 max-[600px]:w-[min(100%_-_24px,_1920px)]">
      <div className="relative">
        <Header />
        <Hero />
      </div>
      <Products />
      <About />
      <Benefits />
      <CallToAction />
      <Testimonials />
      <Footer />
    </main>
  );
}
