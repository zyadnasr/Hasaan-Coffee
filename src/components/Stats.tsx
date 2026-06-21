import React, { useRef, useEffect } from 'react';
import { motion, useInView, animate } from 'motion/react';
import { stats } from '../data/stats';

function AnimatedCounter({ value, decimals = 0, prefix = "", suffix = "" }: { value: number, decimals?: number, prefix?: string, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(v) {
          if (ref.current) {
            ref.current.textContent = prefix + (decimals > 0 ? v.toFixed(decimals) : Math.round(v)) + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [inView, value, decimals, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="py-24 bg-brand-dark/95 relative border-y border-brand-primary/20">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2694&auto=format&fit=crop')] opacity-[0.03] mix-blend-screen bg-cover bg-center pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif font-bold text-white mb-4"
          >
            أرقام <span className="text-gradient-gold">نفتخر بها</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-brand-light/60 text-lg font-light leading-relaxed"
          >
            ثقة عملائنا وجودة منتجاتنا هي سر نجاحنا المستمر.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-dark p-6 md:p-10 rounded-[2rem] border border-brand-light/5 hover:border-brand-primary/30 transition-all duration-500 text-center group flex flex-col items-center justify-center relative overflow-hidden active:scale-95 md:hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
              
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full glass flex items-center justify-center text-brand-primary mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/20 relative z-10">
                <stat.icon size={24} className="md:w-8 md:h-8" strokeWidth={1.5} />
              </div>
              
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-gold font-mono mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)] relative z-10 dir-ltr" dir="ltr">
                <AnimatedCounter 
                  value={stat.value} 
                  decimals={stat.decimals} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                />
              </div>
              <h4 className="text-sm md:text-lg text-white font-bold tracking-wide group-hover:text-brand-light/90 transition-colors relative z-10">
                {stat.title}
              </h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
