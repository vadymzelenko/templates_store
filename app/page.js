import { Hero, Formats, Steps, BookingSection, Faq, Footer } from '@/components/landing/Sections';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Formats />
        <Steps />
        <BookingSection />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
