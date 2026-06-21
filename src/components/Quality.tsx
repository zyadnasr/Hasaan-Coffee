import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Medal, ThumbsUp } from 'lucide-react';

export default function Quality() {
  return (
    <section id="quality" className="py-24 bg-brand-dark/95 border-y border-brand-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(var(--color-brand-primary) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-brand-primary font-bold tracking-[0.2em] text-xs mb-4 block uppercase">لماذا نحن</span>
          <h2 className="text-4xl font-serif font-bold text-white mb-6">التزامنا <span className="text-gradient-gold">بالجودة</span></h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12">
          {[
            { title: "أصالة المذاق", desc: "نعتمد على مصادر بن موثوقة ذات جودة عالية لضمان كوب قهوة لا ينسى.", icon: ShieldCheck },
            { title: "طحن أمام عينيك", desc: "الشفافية هي مبدأنا، نجهز لك القهوة بشكل فوري لتستمتع بالرائحة والنضارة.", icon: Medal },
            { title: "رضا العميل أولاً", desc: "نهتم بكل تفصيلة صغيرة في طلبك لضمان تقديم الخدمة التي تستحقها.", icon: ThumbsUp }
          ].map((item, idx) => (
             <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className="flex-1 text-center glass-dark p-10 rounded-[2rem] border-t border-brand-primary/20 relative group overflow-hidden hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50" />
              <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-brand-primary mb-8 relative">
                 <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-xl group-hover:bg-brand-primary/20 transition-all duration-500" />
                 <div className="absolute inset-2 border-[1px] border-brand-primary/50 border-dashed rounded-full animate-[spin_10s_linear_infinite]" />
                 <item.icon size={42} strokeWidth={1} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-white mb-4 group-hover:text-brand-primary transition-colors">{item.title}</h3>
              <p className="text-brand-light/60 text-lg leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
