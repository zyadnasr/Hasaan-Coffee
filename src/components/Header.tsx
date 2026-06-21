import React from 'react';
import { motion } from 'motion/react';
import { Coffee, MessageCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  whatsappNumber: string;
  isHeroInView: boolean;
  hasMounted: boolean;
}

export default function Header({ whatsappNumber, isHeroInView, hasMounted }: HeaderProps) {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-brand-primary/10">
        <div className="container mx-auto px-4 md:px-6 h-24 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full border-gradient-gold bg-brand-dark/50 flex items-center justify-center text-brand-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Coffee size={24} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wide text-gradient-gold">حسن كوفي</span>
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-60 font-sans text-brand-light">Hassan Coffee</span>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex items-center gap-10 text-sm font-medium text-brand-light/80"
          >
            <a href="#services" className="hover:text-brand-primary transition-all hover:scale-105">الخدمات</a>
            <a href="#about" className="hover:text-brand-primary transition-all hover:scale-105">القصة</a>
            <a href="#testimonials" className="hover:text-brand-primary transition-all hover:scale-105">الآراء</a>
            <a href="#gallery" className="hover:text-brand-primary transition-all hover:scale-105">الرؤية</a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <a 
              href={`https://wa.me/2${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 bg-gradient-gold text-brand-dark px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all hover:-translate-y-0.5"
            >
              <MessageCircle size={18} />
              واتساب
            </a>
          </motion.div>
        </div>
      </nav>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isHeroInView ? 1 : 0 }}
        transition={{ 
          duration: hasMounted ? 0.5 : 1, 
          delay: hasMounted ? 0 : 0.5,
          ease: "easeOut"
        }}
        className={`fixed top-24 left-0 right-0 z-40 bg-brand-dark/95 backdrop-blur-md border-b border-brand-primary/20 py-2.5 overflow-hidden shadow-lg ${isHeroInView ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="hidden md:flex items-center justify-between text-sm font-bold text-brand-light/90">
            {[
              "بن طازة يوميًا",
              "طحن حسب الطلب",
              "توصيل سريع (20 جنيه فقط)",
              "جودة مضمونة"
            ].map((item, index, arr) => (
              <React.Fragment key={index}>
                <div className="flex items-center gap-2 hover:text-brand-primary cursor-default transition-colors">
                  <ShieldCheck size={16} className="text-brand-primary" />
                  <span>{item}</span>
                </div>
                {index < arr.length - 1 && (
                  <div className="w-1 h-1 rounded-full bg-brand-primary/40" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="grid md:hidden grid-cols-2 gap-y-2 gap-x-1 text-[10px] min-[375px]:text-[11px] min-[400px]:text-xs font-bold text-brand-light/90 py-1">
             {[
                "بن طازة يوميًا",
                "طحن حسب الطلب",
                "توصيل سريع بـ 20 جنيه",
                "جودة مضمونة"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-brand-primary shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
             ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
