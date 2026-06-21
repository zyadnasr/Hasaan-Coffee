import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee } from 'lucide-react';

interface PreloaderProps {
  isPreloading: boolean;
}

export default function Preloader({ isPreloading }: PreloaderProps) {
  return (
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
  );
}
