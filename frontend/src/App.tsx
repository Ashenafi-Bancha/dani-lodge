import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import QuickActions from '@/components/layout/QuickActions';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Experiences from '@/components/sections/Experiences';
import Gallery from '@/components/sections/Gallery';
import Location from '@/components/sections/Location';
import Contact from '@/components/sections/Contact';
import type { StayRequest } from '@/lib/inquiry';

export default function App() {
  // Dates picked in the hero's availability bar, handed to the enquiry form
  const [stayRequest, setStayRequest] = useState<StayRequest | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero onCheckAvailability={setStayRequest} />
        <About />
        <Services />
        <Experiences />
        <Gallery />
        <Contact stayRequest={stayRequest} />
        <Location />
      </main>
      <Footer />
      <QuickActions />
    </MotionConfig>
  );
}
