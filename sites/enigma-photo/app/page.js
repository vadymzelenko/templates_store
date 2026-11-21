import Motion from "@/components/Motion";
import Overlays from "@/components/Overlays";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Gallery from "@/components/Gallery";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatCta from "@/components/FloatCta";

export default function Home() {
  return (
    <Overlays>
      <Motion>
        <Header />
        <main>
          <Hero />
          <Intro />
          <Gallery />
          <Services />
          <Pricing />
          <Process />
          <Faq />
          <Contact />
        </main>
        <Footer />
        <FloatCta />
      </Motion>
    </Overlays>
  );
}
