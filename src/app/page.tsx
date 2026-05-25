import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import ParallaxShowcase from "@/components/sections/ParallaxShowcase";
import Services from "@/components/sections/Services";
import Pricing from "@/components/sections/Pricing";
import BulkEdits from "@/components/sections/BulkEdits";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-black">
      <Hero />
      <About />
      <Portfolio />
      <ParallaxShowcase />
      <BulkEdits />
      <Services />
      <Pricing />
      <Testimonials />
      <Contact />
    </main>
  );
}
