'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Bell } from 'lucide-react';
import { useCart } from '../../lib/store';

export default function Toast() {
  const toastMessage = useCart((state) => state.toastMessage);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="fixed bottom-10 left-1/2 z-[100] pointer-events-none"
        >
          <div className="bg-zinc-950/90 backdrop-blur-2xl border border-amber-500/30 px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(245,158,11,0.15)] flex items-center gap-4">
            <div className="relative">
               <CheckCircle2 className="text-amber-500 w-6 h-6 relative z-10" />
               <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-0.5">
                System Notification
              </span>
              <span className="text-zinc-100 font-bold text-sm tracking-wide">
                {toastMessage}
              </span>
            </div>

            {/* Decorative element to match your Command Center theme */}
            <div className="ml-4 pl-4 border-l border-zinc-800">
              <Bell className="text-zinc-500 w-4 h-4 opacity-50" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}