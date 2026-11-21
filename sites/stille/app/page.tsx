import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Philosophy } from "@/components/philosophy"
import { Features } from "@/components/features"
import { Testimonial } from "@/components/testimonial"
import { Pricing } from "@/components/pricing"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Philosophy />
      <Features />
      <Testimonial />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  )
}
