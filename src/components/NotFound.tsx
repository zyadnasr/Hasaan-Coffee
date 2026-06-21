import React from 'react';
import { motion } from 'motion/react';
import { Coffee, MessageCircle } from 'lucide-react';

interface NotFoundProps {
  whatsappNumber: string;
}

export default function NotFound({ whatsappNumber }: NotFoundProps) {
  return (
    <div className="min-h-screen noise-bg font-sans bg-brand-dark text-brand-light flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2694&auto=format&fit=crop')] opacity-[0.05] mix-blend-screen bg-cover bg-center pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-dark p-10 md:p-14 rounded-[2rem] border border-brand-primary/20 text-center max-w-lg w-full relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl"
      >
        <Coffee size={56} className="mx-auto text-brand-primary mb-8" />
        <h1 className="text-6xl md:text-8xl font-serif text-white font-bold mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gradient-gold mb-4 mt-8">يبدو أنك ضللت الطريق ☕</h2>
        <p className="text-brand-light/70 mb-10 text-lg">الصفحة التي تبحث عنها غير موجودة.</p>
        <div className="flex flex-col gap-4">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 bg-gradient-gold text-brand-dark w-full py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all justify-center text-lg">
            العودة للرئيسية
          </button>
          <button onClick={() => window.open(`https://wa.me/2${whatsappNumber}`, '_blank')} className="glass border border-brand-light/10 hover:border-brand-primary/40 hover:bg-brand-primary/10 text-white w-full py-4 rounded-xl font-bold transition-all justify-center flex items-center gap-2 text-lg">
            التواصل عبر واتساب
            <MessageCircle size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
