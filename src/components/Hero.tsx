import React from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';
import { Phone, MessageCircle } from 'lucide-react';
import { heroImage } from '../assets/images/hero-section.webp'

interface HeroProps {
  heroRef: React.RefObject<HTMLElement | null>;
  bgY: MotionValue<string>;
  bgScale: MotionValue<number>;
  heroOpacity: MotionValue<number>;
  heroY: MotionValue<string>;
  overlayOpacity: MotionValue<number>;
  smokeY: MotionValue<string>;
  scrollY: MotionValue<number>;
  phoneNumber: string;
  whatsappNumber: string;
}

export default function Hero({ 
  heroRef, 
  bgY, 
  bgScale, 
  heroOpacity, 
  heroY, 
  overlayOpacity, 
  smokeY, 
  scrollY,
  phoneNumber,
  whatsappNumber 
}: HeroProps) {
  const glowOpacity = useTransform(scrollY, [0, 500], [0.3, 0.6]);
  const hazeY = useTransform(scrollY, [0, 1000], ['0%', '-15%']);
  const hazeOpacity = useTransform(scrollY, [0, 500], [0.15, 0.05]);

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col justify-center min-h-[90vh]">
      <motion.div className="absolute inset-0 z-0 origin-center" style={{ y: bgY, scale: bgScale }}>
        <img 
          src={heroImage}
          alt="Hassan Coffee Premium Package" 
          className="w-full h-full object-cover select-none pointer-events-none object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-brand-dark/95 via-brand-dark/70 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-brand-dark to-transparent z-10" />
        
        <motion.div 
          style={{ y: smokeY, opacity: glowOpacity }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none z-10 mix-blend-screen"
        />

        <motion.div 
          style={{ y: hazeY, opacity: hazeOpacity }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2694&auto=format&fit=crop')] mix-blend-screen bg-cover bg-center pointer-events-none blur-[50px] z-10 scale-125"
        />
        
        <motion.div 
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-brand-dark z-20 pointer-events-none" 
        />
      </motion.div>

      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="container mx-auto px-4 md:px-6 relative z-30">
        <div className="flex flex-col lg:flex-row justify-start items-center">
          <div className="max-w-2xl lg:w-3/5 relative z-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-dark text-brand-primary text-xs font-bold uppercase tracking-widest mb-8 border border-brand-primary/20 backdrop-blur-xl"
            >
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span>قهوة مختصة ومحمصة محلياً</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif text-white leading-[1.1] mb-8"
            >
              بن طازة <br /> <span className="text-gradient-gold italic">بأعلى جودة</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-brand-light/70 mb-12 max-w-xl leading-relaxed font-light"
            >
              في حسن كوفي، نؤمن أن القهوة ليست مجرد مشروب، بل هي تجربة يومية تستحق أجود أنواع البن المحمص بعناية ليرضي ذائقتك.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center justify-center gap-3 bg-gradient-gold text-brand-dark px-10 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all hover:-translate-y-1"
              >
                <Phone size={20} />
                اطلب الآن
              </a>
              <a 
                href={`https://wa.me/2${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 glass text-white px-10 py-4 rounded-full font-bold text-lg hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all hover:-translate-y-1"
              >
                <MessageCircle size={20} className="text-brand-primary" />
                راسلنا
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
