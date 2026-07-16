import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Coffee, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/config';

interface ExitPopupProps {
  showExitPopup: boolean;
  setShowExitPopup: (show: boolean) => void;
  whatsappNumber: string;
}

export default function ExitPopup({ showExitPopup, setShowExitPopup, whatsappNumber }: ExitPopupProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showExitPopup) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowExitPopup(false);
        return;
      }
      if (e.key === 'Tab' && popupRef.current) {
        const focusable = popupRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showExitPopup, setShowExitPopup]);
  return (
    <AnimatePresence>
      {showExitPopup && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-md"
          onClick={() => setShowExitPopup(false)}
        >
          <motion.div 
            ref={popupRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-popup-title"
            tabIndex={-1}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-dark border border-brand-primary/30 p-10 rounded-[2rem] max-w-md w-full relative shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              ref={closeRef}
              onClick={() => setShowExitPopup(false)}
              className="absolute top-6 left-6 text-brand-light/50 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary rounded"
              aria-label="إغلاق"
            >
              <X size={24} />
            </button>
            
            <div className="w-20 h-20 rounded-full glass border border-brand-primary/20 mx-auto flex items-center justify-center mb-6 shadow-inner text-brand-primary relative">
              <Coffee size={32} />
            </div>
            
            <h3 id="exit-popup-title" className="text-3xl font-serif text-white font-bold mb-3">العرض مازال في انتظارك ☕</h3>
            <p className="text-brand-light/70 mb-8 leading-relaxed">
              استمتع بأجود أنواع البن الطازج والطحن حسب الطلب.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.open(getWhatsAppUrl(whatsappNumber), '_blank')}
                className="w-full bg-gradient-gold text-brand-dark font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-0.5"
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
  );
}
