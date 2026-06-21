import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, MessageCircle, ChevronDown, CheckCircleIcon, BoxSelect, Star } from 'lucide-react';

interface OrderCalculatorProps {
  coffeeType: string;
  setCoffeeType: (type: string) => void;
  quantity: number | string;
  setQuantity: (quantity: number | string) => void;
  quantityDropdownOpen: boolean;
  setQuantityDropdownOpen: (open: boolean) => void;
  coffeePrices: Record<string, number>;
  quantityPresets: Array<{ label: string; value: number }>;
  deliveryFee: number;
  coffeePriceTotal: number;
  orderTotal: number;
  handleOrderCalculatorWhatsapp: () => void;
}

export default function OrderCalculator({
  coffeeType,
  setCoffeeType,
  quantity,
  setQuantity,
  quantityDropdownOpen,
  setQuantityDropdownOpen,
  coffeePrices,
  quantityPresets,
  deliveryFee,
  coffeePriceTotal,
  orderTotal,
  handleOrderCalculatorWhatsapp
}: OrderCalculatorProps) {
  const quantityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (quantityRef.current && !quantityRef.current.contains(event.target as Node)) {
        setQuantityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setQuantityDropdownOpen]);

  return (
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
  );
}
