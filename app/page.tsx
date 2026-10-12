import { Footer } from '@/components/landing/Footer';
import { Hero, Nav } from '@/components/landing/Hero';
import { ForwardTypes, Steps } from '@/components/landing/Steps';
import { CtaBand, Languages, TrustGrid } from '@/components/landing/TrustGrid';
import { VerdictShowcase } from '@/components/landing/VerdictShowcase';

export default function Home() {
  return (
    <div className="bg-white dark:bg-truth-dbg">
      <Nav />
      <main>
        <Hero />
        <ForwardTypes />
        <Steps />
        <VerdictShowcase />
        <Languages />
        <TrustGrid />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
