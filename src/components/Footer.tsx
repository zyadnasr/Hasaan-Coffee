import React from 'react';
import { Coffee } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-light/50 py-16 border-t border-brand-light/5 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-brand-light/10 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-brand-primary/30 flex items-center justify-center text-brand-primary shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              <Coffee size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl text-white tracking-wide">حسن كوفي</span>
              <span className="text-[10px] tracking-[0.3em] font-sans text-brand-primary uppercase">Hassan Coffee</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 font-medium text-brand-light/70">
            <a href="#services" className="hover:text-brand-primary hover:-translate-y-0.5 transition-all">الخدمات</a>
            <a href="#about" className="hover:text-brand-primary hover:-translate-y-0.5 transition-all">القصة</a>
            <a href="#quality" className="hover:text-brand-primary hover:-translate-y-0.5 transition-all">الجودة</a>
            <a href="#testimonials" className="hover:text-brand-primary hover:-translate-y-0.5 transition-all">الآراء</a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4 font-light tracking-wide">
          <p>© {new Date().getFullYear()} حسن كوفي. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-2">
            مصمم بشغف للقهوة <Coffee size={14} className="text-brand-primary" />
          </p>
        </div>
      </div>
    </footer>
  );
}
