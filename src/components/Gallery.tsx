import React, { useRef } from 'react';
import { motion } from 'motion/react';

const galleryImages = [
  { url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2574&auto=format&fit=crop", alt: "أكواب قهوة مختصة على طاولة خشبية" },
  { url: "https://tse3.mm.bing.net/th/id/OIP.9ms6nFzHbc8rbA6bRHBhnwAAAA?cb=thfc1falcon2&w=474&h=845&rs=1&pid=ImgDetMain&o=7&rm=3", alt: "حبات بن محمصة بلون بني غامق" },
  { url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2671&auto=format&fit=crop", alt: "ماكينة طحن بن احترافية" },
  { url: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=2670&auto=format&fit=crop", alt: "مقهى حسن كوفي من الداخل" },
  { url: "https://images.unsplash.com/photo-1495474472201-496e54c7b809?q=80&w=2670&auto=format&fit=crop", alt: "فنجان قهوة مع حبات البن" },
];

export default function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="gallery" className="py-0 relative mt-10 overflow-hidden z-20">
      <div className="w-full pl-4 md:pl-0 md:px-4">
        <motion.div 
          ref={scrollRef}
          role="region"
          aria-label="معرض صور حسن كوفي"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex gap-4 overflow-x-auto pb-10 scrollbar-hide snap-x pt-10 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {galleryImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`snap-center shrink-0 relative rounded-3xl overflow-hidden shadow-2xl ${index % 2 === 0 ? 'w-[70vw] md:w-[400px] h-[500px]' : 'w-[85vw] md:w-[500px] h-[600px] -mt-12'} group border border-brand-light/[0.04]`}
            >
              <div className="absolute inset-0 bg-brand-dark/20 z-10 group-hover:bg-transparent transition-colors duration-700" aria-hidden="true" />
              <img 
                src={img.url} 
                alt={img.alt} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
