import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { testimonials } from '../data/testimonials';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 bg-brand-dark relative overflow-hidden">
      <div className="absolute left-0 top-1/4 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-brand-primary font-bold tracking-[0.2em] text-xs mb-4 block uppercase">آراء العملاء</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">ماذا يقولون <span className="text-gradient-gold">عنا</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-dark p-8 rounded-3xl border border-brand-light/5 hover:border-brand-primary/30 transition-all duration-300 relative group"
            >
              <div className="absolute top-4 right-4 text-brand-primary/10 text-6xl font-serif leading-none group-hover:text-brand-primary/20 transition-colors">"</div>
              <div className="flex items-center gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-brand-primary text-brand-primary" />
                ))}
              </div>
              <p className="text-brand-light/80 text-lg leading-relaxed mb-8 font-light relative z-10">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto border-t border-brand-light/10 pt-6 relative z-10">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center text-brand-dark font-bold text-lg shadow-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <span className="font-bold text-white text-lg tracking-wide">{testimonial.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
