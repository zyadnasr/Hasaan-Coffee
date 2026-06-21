import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { config } from '../data/config';

export default function Contact() {
  const { phoneNumber, whatsappNumber, address, mapLink, email } = config;

  return (
    <section id="contact" className="py-16 md:py-32 bg-brand-dark relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idHJhbnNwYXJlbnQiPjwvcmVjdD4KPHBhdGggZD0iTTAgNDBMNDAgMEgwem00MCA0MEwwIDBoNDB6IiBmaWxsPSJyZ2JhKDIxMiwgMTc1LCA1NSwgMC4wNSkiPjwvcGF0aD4KPC9zdmc+')] opacity-50 z-0" />
      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-gradient-gold rounded-3xl md:rounded-[3rem] p-[1px] md:p-[2px] max-w-6xl mx-auto shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden"
        >
          <div className="bg-brand-dark/90 backdrop-blur-2xl rounded-3xl md:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            
            {/* Contact Info */}
            <div className="lg:w-1/2 p-6 md:p-12 lg:p-20 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 md:mb-6 text-white leading-tight text-center md:text-start">
                اطلب <span className="text-gradient-gold">قهوتك</span> الآن
              </h2>
              <p className="text-brand-light/60 mb-6 md:mb-12 text-base md:text-xl font-light text-center md:text-start">
                نسعد بخدمتكم وتلقي طلباتكم للإستلام من الفرع أو التجهيز المسبق. تواصل معنا بأي وقت.
              </p>
              
              <div className="flex flex-col gap-3 md:gap-6 md:mb-16 relative z-10">
                <a href={`tel:${phoneNumber}`} className="flex items-center gap-4 md:gap-6 group bg-white/5 md:bg-transparent p-4 md:p-4 rounded-2xl hover:bg-brand-primary/5 border border-white/5 md:border-transparent hover:border-brand-primary/10 transition-all w-full">
                  <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-gradient-gold rounded-full flex items-center justify-center text-brand-dark shadow-[0_0_15px_rgba(212,175,55,0.3)] md:shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <Phone size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs md:text-sm text-brand-light/50 md:mb-1 uppercase tracking-wider">اتصال مباشر</span>
                    <span className="font-bold text-lg md:text-2xl text-white dir-ltr block truncate" dir="ltr">{phoneNumber}</span>
                  </div>
                </a>
                
                <a href={`https://wa.me/2${whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 md:gap-6 group bg-white/5 md:bg-transparent p-4 md:p-4 rounded-2xl hover:bg-green-500/5 border border-white/5 md:border-transparent hover:border-green-500/20 transition-all w-full">
                  <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] md:shadow-[0_0_20px_rgba(34,197,94,0.3)] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                    <MessageCircle size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs md:text-sm text-brand-light/50 md:mb-1 uppercase tracking-wider">استفسارات واتساب</span>
                    <span className="font-bold text-lg md:text-2xl text-white dir-ltr block truncate" dir="ltr">{whatsappNumber}</span>
                  </div>
                </a>

                <a href={`mailto:${email}`} className="flex items-center gap-4 md:gap-6 group w-full bg-white/5 md:bg-transparent p-4 md:p-4 rounded-2xl hover:bg-brand-primary/5 border border-white/5 md:border-transparent hover:border-brand-primary/10 transition-all lg:mb-0 mb-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 glass rounded-full flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    <Mail size={20} className="md:w-6 md:h-6" /> 
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs md:text-sm text-brand-light/50 md:mb-1 uppercase tracking-wider">البريد الإلكتروني</span>
                    <span className="font-bold text-sm md:text-xl text-white font-sans tracking-wide block break-words whitespace-normal leading-tight mt-0.5 md:mt-0">{email}</span>
                  </div>
                </a>
              </div>

              <div className="pt-6 md:pt-8 border-t border-brand-light/10 flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border border-brand-primary/30 flex items-center justify-center text-brand-primary animate-[pulse_4s_ease-in-out_infinite]">
                  <Clock size={18} className="md:w-5 md:h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-0.5 md:mb-1 text-sm md:text-base">أوقات العمل</h4>
                  <p className="text-brand-light/60 text-xs md:text-sm leading-relaxed">نفتح أبوابنا يومياً من 8 صباحاً وحتى 12 منتصف الليل.</p>
                </div>
              </div>
            </div>

            {/* Map Area */}
            <div className="lg:w-1/2 min-h-[300px] md:min-h-[400px] lg:min-h-full bg-brand-dark p-6 md:p-8 flex flex-col justify-center items-center relative border-t lg:border-t-0 lg:border-l border-brand-light/5">
               <div className="absolute inset-0 bg-brand-secondary/40 mix-blend-overlay" />
               <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2671&auto=format&fit=crop" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" alt="map bg" />
               
               <div className="glass-dark p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] relative z-10 max-w-sm w-full border border-brand-primary/20 shadow-2xl backdrop-blur-3xl hover:border-brand-primary/50 transition-colors duration-500">
                  <div className="flex items-center md:flex-col md:text-center text-start gap-4 md:gap-0">
                    <div className="w-12 h-12 md:w-20 md:h-20 shrink-0 bg-gradient-gold rounded-full flex items-center justify-center text-brand-dark md:mx-auto md:mb-8 shadow-[0_0_30px_rgba(212,175,55,0.4)] relative">
                      <div className="absolute inset-0 bg-brand-primary scale-[1.5] rounded-full opacity-20 animate-ping" />
                      <MapPin size={24} className="md:w-8 md:h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="block text-xs md:text-2xl font-serif text-brand-light/50 md:text-white md:mb-4 uppercase md:normal-case tracking-wider md:tracking-normal font-bold">موقعنا</h3>
                      <p className="text-white md:text-brand-light/70 md:mb-8 leading-tight md:leading-relaxed text-sm md:text-lg font-bold md:font-light block break-words mt-0.5 md:mt-0">
                        {address}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 md:mt-0 inline-flex items-center justify-center gap-3 bg-white text-brand-dark w-full py-3 md:py-4 rounded-xl md:rounded-xl font-bold hover:bg-gradient-gold hover:text-brand-dark transition-all shadow-lg hover:-translate-y-1 text-sm md:text-base"
                  >
                    احصل على الاتجاهات
                    <MapPin size={16} className="md:w-[18px] md:h-[18px]" />
                  </a>
               </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
}
