import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { services } from '../data/services';
import { trackWhatsappClick } from '../utils/analytics';

interface ServicesProps {
  whatsappNumber: string;
}

export default function Services({ whatsappNumber }: ServicesProps) {
  return (
    <section id="services" className="py-32 bg-brand-dark relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-primary font-bold tracking-[0.2em] text-xs mb-4 block uppercase"
          >
            ماذا نقدم
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-6"
          >
            خدمات <span className="text-gradient-gold">حسن كوفي</span>
          </motion.h2>
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-1 bg-gradient-gold mx-auto mb-6 rounded-full" 
          />
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-light/60 text-lg font-light leading-relaxed"
          >
            نحرص على تلبية كافة أذواق عشاق القهوة من خلال مجموعة متنوعة من خدمات الطحن والتجهيز الفوري بمعايير استثنائية.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.a 
              href={`https://wa.me/2${whatsappNumber}?text=${encodeURIComponent(service.waMessage)}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsappClick(service.title)}
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative block cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
              <div className="relative h-full glass-dark p-8 rounded-3xl border border-brand-light/5 hover:border-brand-primary/30 transition-all duration-500 overflow-hidden flex flex-col">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all duration-700" />
                
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-brand-primary mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-black/20 shrink-0">
                  <service.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold font-serif text-white mb-4 group-hover:text-gradient-gold transition-colors duration-300">{service.title}</h3>
                <p className="text-brand-light/60 leading-relaxed font-light mb-6 flex-1">
                  {service.desc}
                </p>
                <div className="flex items-center gap-2 text-brand-primary font-bold group-hover:translate-x-[-8px] transition-transform duration-300 mt-auto">
                  <MessageCircle size={18} />
                  <span className="text-sm">اطلب عبر واتساب</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
