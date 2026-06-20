import React, { useState, useEffect } from 'react';
import { Coffee, MapPin, Phone, MessageCircle, Clock, Star, ShieldCheck, ThumbsUp, Medal, Mail, BoxSelect, CheckCircleIcon, Nut, SlidersHorizontal, ChevronDown, Users, Award, ShoppingBag, StarHalf, X, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence, useInView, animate } from 'motion/react';
import heroImage from "./assets/images/hero-section.jpg";

const phoneNumber = "01281515233";
const whatsappNumber = "01063053320";
const address = "الصيادين - الموقف الجديد - أمام عطارة الجمال";
const mapLink = "https://maps.app.goo.gl/xnNX8Yu1RRJjmdHY8";
const email = "hassancoffee.eg@gmail.com";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const trackWhatsappClick = (serviceName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'service_click', {
      service_name: serviceName,
      click_type: 'card',
      section: 'services'
    });
    window.gtag('event', 'whatsapp_click', {
      source_section: 'services',
      service_name: serviceName
    });
  }
};

function AnimatedCounter({ value, decimals = 0, prefix = "", suffix = "" }: { value: number, decimals?: number, prefix?: string, suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  React.useEffect(() => {
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

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function App() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 1000], ['0%', '20%']);
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], ['0%', '20%']);
  const overlayOpacity = useTransform(scrollY, [0, 500], [0, 0.7]);
  const smokeY = useTransform(scrollY, [0, 1000], ['0%', '-50%']);
  const glowOpacity = useTransform(scrollY, [0, 500], [0.3, 0.6]);
  const hazeY = useTransform(scrollY, [0, 1000], ['0%', '-15%']);
  const hazeOpacity = useTransform(scrollY, [0, 500], [0.15, 0.05]);

  const [coffeeType, setCoffeeType] = useState('بن سادة');
  const [quantity, setQuantity] = useState<number | string>(1);
  const [quantityDropdownOpen, setQuantityDropdownOpen] = useState(false);
  const quantityRef = React.useRef<HTMLDivElement>(null);
  
  const heroRef = React.useRef<HTMLElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const isHeroInView = useInView(heroRef, { margin: "-20% 0px 0px 0px" });
  
  const [isPreloading, setIsPreloading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownExitPopup, setHasShownExitPopup] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;

    if (path !== "/" && path !== "/Hasaan-Coffee/") {
      setIs404(true);
      setIsPreloading(false);
    } else {
      const handleLoad = () => setIsPreloading(false);

      if (document.readyState === "complete") {
        setIsPreloading(false);
      } else {
        window.addEventListener("load", handleLoad);
      }

      const timer = setTimeout(() => setIsPreloading(false), 3000);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(timer);
      };
    }
  }, []);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitPopup && window.innerWidth >= 768) {
        setShowExitPopup(true);
        setHasShownExitPopup(true);
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShownExitPopup]);

  useEffect(() => {
    const timer = setTimeout(() => setHasMounted(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (quantityRef.current && !quantityRef.current.contains(event.target as Node)) {
        setQuantityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const quantityPresets = [
    { label: 'ثمن كيلو (0.125 كجم)', value: 0.125 },
    { label: 'ربع كيلو (0.25 كجم)', value: 0.25 },
    { label: 'نصف كيلو (0.5 كجم)', value: 0.5 },
    { label: 'ثلاثة أرباع كيلو (0.75 كجم)', value: 0.75 },
    { label: 'كيلو كامل (1 كجم)', value: 1 }
  ];

  const coffeePrices: Record<string, number> = {
    'بن سادة': 560,
    'بن محوج': 600,
    'بن بالبندق': 700
  };

  const deliveryFee = 20;

  const coffeePriceTotal = coffeePrices[coffeeType] * (Number(quantity) || 0);
  const orderTotal = coffeePriceTotal + (Number(quantity) > 0 ? deliveryFee : 0);

  const handleOrderCalculatorWhatsapp = () => {
    trackWhatsappClick(`حاسبة الطلب - ${coffeeType}`);
    const message = `السلام عليكم،\nأرغب في طلب:\n\nالنوع: ${coffeeType}\nالكمية: ${quantity} كيلو\n\nسعر البن: ${coffeePriceTotal.toFixed(0)} جنيه\nالتوصيل: ${deliveryFee} جنيه\nالإجمالي: ${orderTotal.toFixed(0)} جنيه\n\nيرجى التواصل معي لإتمام الطلب.`;
    window.open(`https://wa.me/2${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  if (is404) {
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
             <button onClick={() => window.open(`https://wa.me/201063053320`, '_blank')} className="glass border border-brand-light/10 hover:border-brand-primary/40 hover:bg-brand-primary/10 text-white w-full py-4 rounded-xl font-bold transition-all justify-center flex items-center gap-2 text-lg">
               التواصل عبر واتساب
               <MessageCircle size={20} />
             </button>
           </div>
         </motion.div>
       </div>
     );
  }

  return (
    <div className="min-h-screen noise-bg font-sans bg-brand-dark text-brand-light selection:bg-brand-primary selection:text-brand-dark">
      {/* Navigation */}
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

      {/* Trust Bar (Appears under Nav) */}
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
          {/* Desktop trust bar items */}
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
          
          {/* Mobile trust bar items (2x2 grid) */}
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

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col justify-center min-h-[90vh]">
        {/* Background Layers */}
        <motion.div className="absolute inset-0 z-0 origin-center" style={{ y: bgY, scale: bgScale }}>
          <img 
            src={heroImage}
            alt="Hassan Coffee Premium Package" 
            className="w-full h-full object-cover select-none pointer-events-none object-center"
          />
          {/* Gradient to darken the right side for text readability in RTL */}
          <div className="absolute inset-0 bg-gradient-to-l from-brand-dark/95 via-brand-dark/70 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-brand-dark to-transparent z-10" />
          
          {/* Drifting Golden Glow */}
          <motion.div 
            style={{ y: smokeY, opacity: glowOpacity }}
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none z-10 mix-blend-screen"
          />

          {/* Subtle animated smoke/haze texture */}
          <motion.div 
            style={{ y: hazeY, opacity: hazeOpacity }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2694&auto=format&fit=crop')] mix-blend-screen bg-cover bg-center pointer-events-none blur-[50px] z-10 scale-125"
          />
          
          {/* Dark Overlay that intensifies on scroll */}
          <motion.div 
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-brand-dark z-20 pointer-events-none" 
          />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="container mx-auto px-4 md:px-6 relative z-30">
          <div className="flex flex-col lg:flex-row justify-start items-center">
            <div className="max-w-2xl lg:w-3/5 relative z-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-dark text-brand-primary text-xs font-bold uppercase tracking-widest mb-8 border border-brand-primary/20 backdrop-blur-xl"
              >
                <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                <span>قهوة مختصة ومحمصة محلياً</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif text-white leading-[1.1] mb-8"
              >
                بن طازة <br /> <span className="text-gradient-gold italic">بأعلى جودة</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-brand-light/70 mb-12 max-w-xl leading-relaxed font-light"
              >
                في حسن كوفي، نؤمن أن القهوة ليست مجرد مشروب، بل هي تجربة يومية تستحق أجود أنواع البن المحمص بعناية ليرضي ذائقتك.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-5"
              >
                <a 
                  href={`tel:${phoneNumber}`}
                  className="flex items-center justify-center gap-3 bg-gradient-gold text-brand-dark px-10 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all hover:-translate-y-1"
                >
                  <Phone size={20} />
                  اطلب الآن
                </a>
                <a 
                  href={`https://wa.me/2${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 glass text-white px-10 py-4 rounded-full font-bold text-lg hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all hover:-translate-y-1"
                >
                  <MessageCircle size={20} className="text-brand-primary" />
                  راسلنا
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Coffee Order Calculator Section */}
      <section className="py-24 bg-brand-dark/95 relative overflow-hidden" id="calculator">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2694&auto=format&fit=crop')] opacity-[0.02] mix-blend-screen bg-cover bg-center pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                {[
                  "طحن يومي طازج",
                  "توصيل سريع",
                  "أسعار واضحة",
                  "طلب مباشر عبر واتساب"
                ].map((badge, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-dark border border-brand-primary/20 text-brand-primary text-xs font-bold">
                    <CheckCircleIcon size={12} /> {badge}
                  </span>
                ))}
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
              >
                احسب <span className="text-gradient-gold">سعر طلبك</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-brand-light/60 text-lg font-light"
              >
                اختر نوع البن والكمية وسيتم حساب السعر فورًا مع تكلفة التوصيل.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-dark border border-brand-primary/30 rounded-[2rem] p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Coffee Type Selection */}
                <div className="flex flex-col gap-3">
                  <label className="text-brand-light/80 font-bold ml-1 flex items-center gap-2">
                    <Coffee size={18} className="text-brand-primary" /> نوع البن
                  </label>
                  <div className="relative">
                    <select 
                      value={coffeeType}
                      onChange={(e) => setCoffeeType(e.target.value)}
                      className="w-full bg-brand-dark/80 border border-brand-primary/20 rounded-xl px-5 py-4 text-white appearance-none focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all pr-12 cursor-pointer font-bold"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                    >
                      {Object.keys(coffeePrices).map(type => (
                        <option key={type} value={type} className="bg-brand-dark text-white p-4">
                          {type} ({coffeePrices[type]} جنيه / كيلو)
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-brand-primary">
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-current" />
                    </div>
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="flex flex-col gap-3 relative" ref={quantityRef}>
                  <label className="text-brand-light/80 font-bold ml-1 w-full text-right flex items-center gap-2">
                    <BoxSelect size={18} className="text-brand-primary" /> الكمية (بالكيلو)
                  </label>
                  <div 
                    className={`relative w-full bg-brand-dark/80 border ${quantityDropdownOpen ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-brand-primary/20'} rounded-xl transition-all flex items-center`}
                  >
                    <input 
                      type="number"
                      min="0"
                      step="0.125"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                      onFocus={() => setQuantityDropdownOpen(true)}
                      className="w-full bg-transparent px-5 py-4 text-white focus:outline-none text-right font-bold"
                      placeholder="اكتب الكمية أو اختر وزنًا جاهزًا"
                    />
                    <button 
                      type="button"
                      onClick={() => setQuantityDropdownOpen(!quantityDropdownOpen)}
                      className="absolute left-0 top-0 bottom-0 px-4 text-brand-primary flex items-center justify-center cursor-pointer hover:bg-brand-primary/10 rounded-l-xl transition-colors"
                    >
                      <ChevronDown size={20} className={`transition-transform duration-300 ${quantityDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {quantityDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[100%] left-0 right-0 mt-2 bg-brand-dark glass border border-brand-primary/30 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
                      >
                        <div className="px-4 py-3 border-b border-white/5 bg-black/20 text-brand-light/50 text-xs font-bold tracking-wider">
                          الأوزان الشائعة: ثمن - ربع - نصف - ثلاثة أرباع - كيلو
                        </div>
                        <div className="flex flex-col max-h-60 overflow-y-auto custom-scrollbar">
                          {quantityPresets.map((preset, idx) => {
                            const presetPrice = coffeePrices[coffeeType] * preset.value;
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setQuantity(preset.value);
                                  setQuantityDropdownOpen(false);
                                }}
                                className="w-full text-right px-5 py-3 hover:bg-brand-primary/10 transition-colors flex justify-between items-center border-b border-white/5 last:border-0 group"
                              >
                                <span className="text-white font-bold group-hover:text-brand-primary transition-colors">{preset.label}</span>
                                <span className="text-brand-light/70 font-mono text-sm">{presetPrice.toFixed(0)} جنيه</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Results Area */}
              <div className="bg-brand-dark/50 rounded-2xl p-6 md:p-8 border border-white/5 mb-8">
                <div className="flex justify-between items-center mb-4 text-brand-light/70 text-lg">
                  <span>سعر البن:</span>
                  <span className="font-bold text-white font-mono">{coffeePriceTotal.toFixed(0)} جنيه</span>
                </div>
                <div className="flex justify-between items-center mb-6 text-brand-light/70 text-lg border-b border-white/5 pb-6">
                  <span>التوصيل:</span>
                  <span className="font-bold text-white font-mono">{Number(quantity) > 0 ? deliveryFee : 0} جنيه</span>
                </div>
                <div className="flex justify-between items-center text-xl md:text-2xl font-bold">
                  <span className="text-white">الإجمالي:</span>
                  <motion.span 
                    key={orderTotal}
                    initial={{ scale: 0.8, opacity: 0, color: "#fff" }}
                    animate={{ scale: 1, opacity: 1, color: "#d4af37" }}
                    className="text-gradient-gold font-mono drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  >
                    {orderTotal.toFixed(0)} جنيه
                  </motion.span>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={handleOrderCalculatorWhatsapp}
                disabled={!quantity || Number(quantity) <= 0}
                className="w-full flex items-center justify-center gap-3 bg-gradient-gold text-brand-dark py-5 rounded-xl font-bold text-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <MessageCircle size={22} />
                اطلب الآن عبر واتساب
              </button>

              <div className="mt-6 text-center">
                <p className="text-brand-light/40 text-xs flex justify-center items-center gap-1.5 opacity-80 font-light max-w-sm mx-auto leading-relaxed">
                  <Star size={10} className="text-brand-primary" />
                  *نلتزم بتقديم أفضل جودة بأفضل سعر، لذلك يتم تحديث الأسعار بشكل دوري وفقًا لأسعار البن اليومية.*
                  <Star size={10} className="text-brand-primary" />
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
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
            {[
              { title: "حبوب بن طازجة", desc: "أجود أنواع البن المستورد والمحمص بعناية فائقة للحفاظ على الزيوت العطرية والنكهة الأصيلة.", icon: Coffee, waMessage: "السلام عليكم، أريد الاستفسار عن حبوب البن الطازجة." },
              { title: "طحن يومي فوري", desc: "نضمن لك طحن القهوة فور طلبك للحفاظ على أقصى درجات النضارة والرائحة الزكية.", icon: Clock, waMessage: "السلام عليكم، أريد الاستفسار عن الطحن اليومي." },
              { title: "بن محوج", desc: "خلطات قهوة تركية أصيلة بدرجات تحميص متعددة، محوجة بعناية حسب رغبتك.", icon: CheckCircleIcon, waMessage: "السلام عليكم، أريد الاستفسار عن البن المحوج." },
              { title: "بن سادة", desc: "لمحبي المذاق الكلاسيكي القوي، بن سادة صافي بدون أي إضافات يعكس جودة الحبة.", icon: BoxSelect, waMessage: "السلام عليكم، أريد الاستفسار عن البن السادة." },
              { title: "بن بالبندق", desc: "مزيج غني يجمع بين نكهة القهوة الفاخرة ورائحة ومذاق البندق المحمص اللذيذ.", icon: Nut, waMessage: "السلام عليكم، أريد الاستفسار عن بن البندق." },
              { title: "طحن حسب الطلب", desc: "نطحن قهوتك بالدرجة التي تناسب أداة التحضير الخاصة بك، فلتر، اسبريسو وغيرها.", icon: SlidersHorizontal, waMessage: "السلام عليكم، أريد معرفة تفاصيل الطحن حسب الطلب." }
            ].map((service, index) => (
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
                  {/* Subtle inner light effect */}
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

      {/* Statistics Section */}
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
            {[
              { icon: Users, value: 2000, prefix: "+", title: "عميل سعيد" },
              { icon: Award, value: 5, prefix: "+", title: "سنوات من الخبرة" },
              { icon: ShoppingBag, value: 5000, prefix: "+", title: "كيلو بن تم بيعه" },
              { icon: StarHalf, value: 4.9, decimals: 1, suffix: "/5", title: "متوسط تقييم العملاء" }
            ].map((stat, idx) => (
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

      {/* About Section */}
      <section id="about" className="py-32 bg-brand-dark relative overflow-hidden">
        {/* Artistic Background Elements */}
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
              
              {/* Floating Badge */}
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

      {/* Trust & Credibility Section */}
      <section id="quality" className="py-24 bg-brand-dark/95 border-y border-brand-primary/10 relative overflow-hidden">
        {/* Subtle patterned background for deep texture */}
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-brand-dark relative overflow-hidden">
        <div className="absolute left-0 top-1/4 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-brand-primary font-bold tracking-[0.2em] text-xs mb-4 block uppercase">آراء العملاء</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">ماذا يقولون <span className="text-gradient-gold">عنا</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: "أحمد م.",
                text: "من أفضل أنواع البن اللي جربتها، الريحة قوية والطعم مظبوط جداً. بقى هو البن الأساسي عندي في البيت."
              },
              {
                name: "محمد ع.",
                text: "البن المحوج ممتاز وطازة فعلاً، واضح إن الطحن بيتم أول بأول. خدمة محترمة وسرعة في التسليم."
              },
              {
                name: "إسراء س.",
                text: "جربت بن البندق وكان رائع، النكهة واضحة ومش مبالغ فيها. أنصح أي محب للقهوة يجربه."
              },
              {
                name: "محمود ح.",
                text: "الأسعار مناسبة جداً مقارنة بالجودة. البن طازة والفرق واضح من أول فنجان."
              },
              {
                name: "كريم أ.",
                text: "أكتر حاجة عجبتني إنهم بيطحنوا البن حسب الطلب، والطعم ثابت كل مرة بطلب."
              },
              {
                name: "عبد الرحمن ج.",
                text: "ريحة البن الأصلي فعلاً، جودة ممتازة وتعامل راقي. أكيد هكرر الشراء."
              }
            ].map((testimonial, idx) => (
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

      {/* Gallery Section */}
      <section id="gallery" className="py-0 relative mt-10 overflow-hidden z-20">
        <div className="w-full pl-4 md:pl-0 md:px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-4 overflow-x-auto pb-10 scrollbar-hide snap-x pt-10"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {[
              "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2574&auto=format&fit=crop",
              "https://tse3.mm.bing.net/th/id/OIP.9ms6nFzHbc8rbA6bRHBhnwAAAA?cb=thfc1falcon2&w=474&h=845&rs=1&pid=ImgDetMain&o=7&rm=3",
              "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2671&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=2670&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1495474472201-496e54c7b809?q=80&w=2670&auto=format&fit=crop",
            ].map((imgUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`snap-center shrink-0 relative rounded-3xl overflow-hidden shadow-2xl ${index % 2 === 0 ? 'w-[70vw] md:w-[400px] h-[500px]' : 'w-[85vw] md:w-[500px] h-[600px] -mt-12'} group border border-brand-light/10`}
              >
                <div className="absolute inset-0 bg-brand-dark/20 z-10 group-hover:bg-transparent transition-colors duration-700" />
                <img 
                  src={imgUrl} 
                  alt={`Hassan Coffee Gallery Image ${index + 1}`} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA & Location Section */}
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

      {/* Footer */}
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

      {/* Mobile Sticky WhatsApp */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <a 
          href={`https://wa.me/201063053320?text=${encodeURIComponent('السلام عليكم، أريد الاستفسار عن منتجات حسن كوفي.')}`}
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:scale-105 active:scale-95 transition-transform relative group"
        >
          <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40 duration-1000" />
          <MessageCircle size={28} className="relative z-10" />
        </a>
      </div>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-dark border border-brand-primary/30 p-10 rounded-[2rem] max-w-md w-full relative shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center"
            >
              <button 
                onClick={() => setShowExitPopup(false)}
                className="absolute top-6 left-6 text-brand-light/50 hover:text-white transition-colors"
                aria-label="إغلاق"
              >
                <X size={24} />
              </button>
              
              <div className="w-20 h-20 rounded-full glass border border-brand-primary/20 mx-auto flex items-center justify-center mb-6 shadow-inner text-brand-primary relative">
                <Coffee size={32} />
              </div>
              
              <h3 className="text-3xl font-serif text-white font-bold mb-3">العرض مازال في انتظارك ☕</h3>
              <p className="text-brand-light/70 mb-8 leading-relaxed">
                استمتع بأجود أنواع البن الطازج والطحن حسب الطلب.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.open(`https://wa.me/201063053320`, '_blank')}
                  className="w-full bg-gradient-gold text-brand-dark font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all hover:-translate-y-1"
                >
                  <MessageCircle size={20} />
                  تواصل عبر واتساب
                </button>
                <button 
                  onClick={() => setShowExitPopup(false)}
                  className="w-full bg-transparent border border-white/10 text-brand-light/80 hover:text-white hover:border-brand-primary/30 font-bold py-4 rounded-xl transition-colors"
                >
                  متابعة التصفح
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Preloader */}
      <AnimatePresence>
        {isPreloading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[200] bg-brand-dark flex flex-col items-center justify-center"
          >
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Outer spinning ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-brand-primary/20 border-t-brand-primary"
              />
              <Coffee size={40} className="text-brand-primary animate-pulse relative z-10" />
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-2xl font-serif text-white font-bold tracking-wide"
            >
              حسن <span className="text-gradient-gold">كوفي</span>
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}