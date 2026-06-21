import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useScroll, useTransform, useInView } from 'motion/react';
import { MessageCircle } from 'lucide-react';

import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import ExitPopup from './components/ExitPopup';
import NotFound from './components/NotFound';
import { config } from './data/config';
import { useOrderCalculator } from './hooks/useOrderCalculator';

// Lazy loading below-the-fold sections
const OrderCalculator = lazy(() => import('./components/OrderCalculator'));
const Services = lazy(() => import('./components/Services'));
const Stats = lazy(() => import('./components/Stats'));
const About = lazy(() => import('./components/About'));
const Quality = lazy(() => import('./components/Quality'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Gallery = lazy(() => import('./components/Gallery'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

export default function App() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 1000], ['0%', '20%']);
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], ['0%', '20%']);
  const overlayOpacity = useTransform(scrollY, [0, 500], [0, 0.7]);
  const smokeY = useTransform(scrollY, [0, 1000], ['0%', '-50%']);

  const orderCalculator = useOrderCalculator();
  
  const heroRef = React.useRef<HTMLElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const isHeroInView = useInView(heroRef, { margin: "-20% 0px 0px 0px" });
  
  const [isPreloading, setIsPreloading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownExitPopup, setHasShownExitPopup] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;

    if (path !== "/" && path !== "/Hasaan-Coffee/") {
      setIs404(true);
      setIsPreloading(false);
    } else {
      const handleLoad = () => setIsPreloading(false);

      if (document.readyState === "complete") {
        setIsPreloading(false);
      } else {
        window.addEventListener("load", handleLoad);
      }

      const timer = setTimeout(() => setIsPreloading(false), 3000);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(timer);
      };
    }
  }, []);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitPopup && window.innerWidth >= 768) {
        setShowExitPopup(true);
        setHasShownExitPopup(true);
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShownExitPopup]);

  useEffect(() => {
    const timer = setTimeout(() => setHasMounted(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (is404) {
     return <NotFound whatsappNumber={config.whatsappNumber} />;
  }

  return (
    <div className="min-h-screen noise-bg font-sans bg-brand-dark text-brand-light selection:bg-brand-primary selection:text-brand-dark">
      <Header 
        whatsappNumber={config.whatsappNumber}
        isHeroInView={isHeroInView}
        hasMounted={hasMounted}
      />

      <Hero 
        heroRef={heroRef}
        bgY={bgY}
        bgScale={bgScale}
        heroOpacity={heroOpacity}
        heroY={heroY}
        overlayOpacity={overlayOpacity}
        smokeY={smokeY}
        scrollY={scrollY}
        phoneNumber={config.phoneNumber}
        whatsappNumber={config.whatsappNumber}
      />

      <Suspense fallback={<div className="py-24 text-center glass text-brand-primary">جاري التحميل...</div>}>
        <OrderCalculator {...orderCalculator} />
        <Services whatsappNumber={config.whatsappNumber} />
        <Stats />
        <About />
        <Quality />
        <Testimonials />
        <Gallery />
        <Contact />
        <Footer />
      </Suspense>

      {/* Mobile Sticky WhatsApp */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <a 
          href={`https://wa.me/2${config.whatsappNumber}?text=${encodeURIComponent('السلام عليكم، أريد الاستفسار عن منتجات حسن كوفي.')}`}
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:scale-105 active:scale-95 transition-transform relative group"
        >
          <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40 duration-1000" />
          <MessageCircle size={28} className="relative z-10" />
        </a>
      </div>

      <ExitPopup 
        showExitPopup={showExitPopup} 
        setShowExitPopup={setShowExitPopup} 
        whatsappNumber={config.whatsappNumber}
      />

      <Preloader isPreloading={isPreloading} />
    </div>
  );
}

