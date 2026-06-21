import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-32 bg-brand-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/40 rounded-full blur-[150px] mix-blend-multiply pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-brand-light/10 aspect-[4/5] object-cover group">
               <img 
                src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=2670&auto=format&fit=crop" 
                alt="Hassan Coffee Shop Setup"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
              <div className="absolute inset-0 border-[1px] border-brand-primary/20 rounded-[2rem] z-20 m-4 pointer-events-none" />
              <div className="absolute bottom-8 right-8 left-8 text-center z-30">
                <p className="font-serif text-2xl italic font-bold text-gradient-gold">"أجود أنواع البن، وأفضل طحن"</p>
              </div>
            </div>
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 lg:-right-12 glass p-4 rounded-2xl border border-brand-primary/30 shadow-2xl backdrop-blur-xl flex items-center gap-3"
            >
              <div className="bg-gradient-gold p-3 rounded-full text-brand-dark">
                <Star size={20} className="fill-brand-dark" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">خبرة أصيلة</p>
                <p className="text-brand-light/60 text-xs">في عالم القهوة</p>
              </div>
            </motion.div>
          </motion.div>

          <div className="lg:w-1/2">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-brand-primary font-bold tracking-[0.2em] text-xs mb-4 block uppercase"
            >
              قصتنا
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight"
            >
              شغف القهوة، من المحمصة <span className="text-gradient-gold">إلى فنجانك</span>
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-brand-light/70 text-lg leading-relaxed font-light"
            >
              <p>
                في "حسن كوفي"، نحن لا نبيع مجرد قهوة، بل نقدم خلاصة خبرة وشغف في اختيار أفضل حقول البن حول العالم وضمان وصولها إليك بأعلى معايير الجودة.
              </p>
              <p>
                يقع مقر محمصة ومتجر حسن كوفي في قلب منطقة الصيادين - الموقف الجديد، ليقدم لأهالي المنطقة والزوار تجربة متكاملة تبدأ من روائح التحميص الذكية التي تملأ المكان، وتنتهي بفنجان قهوة يصنع يومك.
              </p>
              <p>
                نسعى دائمًا لنكون الوجهة الأولى لكل باحث عن "المزاج المضبوط"، عبر التزامنا التام بنضارة الحبوب والطحن اليومي.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex flex-wrap gap-8"
            >
              <div className="glass-dark px-6 py-4 rounded-2xl border-l-2 border-l-brand-primary flex-1 min-w-[140px]">
                <h4 className="text-3xl font-serif font-bold text-white mb-1">+1000</h4>
                <p className="text-xs text-brand-primary uppercase tracking-wider">عميل سعيد</p>
              </div>
              <div className="glass-dark px-6 py-4 rounded-2xl border-l-2 border-l-brand-primary flex-1 min-w-[140px]">
                <h4 className="text-3xl font-serif font-bold text-white mb-1">%100</h4>
                <p className="text-xs text-brand-primary uppercase tracking-wider">بن طازج يومياً</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
