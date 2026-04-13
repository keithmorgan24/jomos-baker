'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../../lib/store';

export default function Toast() {
  const toastMessage = useCart((state) => state.toastMessage);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
        >
          <div className="bg-zinc-950/80 backdrop-blur-xl border border-amber-500/50 px-6 py-3 rounded-2xl shadow-2xl shadow-amber-900/20 flex items-center gap-3">
            <CheckCircle2 className="text-amber-500 w-5 h-5" />
            <span className="text-zinc-100 font-medium">{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}