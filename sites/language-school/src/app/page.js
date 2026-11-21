import { getContent } from '@/lib/store';
import { ContentProvider } from '@/components/ContentProvider';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Departures from '@/components/Departures';
import Lesson from '@/components/Lesson';
import Compare from '@/components/Compare';
import Baggage from '@/components/Baggage';
import Route from '@/components/Route';
import BoardingPass from '@/components/BoardingPass';
import Pricing from '@/components/Pricing';
import Faq from '@/components/Faq';
import Callback from '@/components/Callback';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import MobileBar from '@/components/MobileBar';

export default async function Home() {
  const content = await getContent();
  return (
    <ContentProvider value={content}>
      <Header />
      <main id="top" className="page">
        <Hero />
        <Marquee />
        <Departures />
        <Lesson />
        <Compare />
        <Baggage />
        <Route />
        <BoardingPass />
        <Pricing />
        <Faq />
        <Callback />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </ContentProvider>
  );
}
