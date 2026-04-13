'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950">
      
      {/* 1. BACKGROUND GLOW: This makes the site look "Expensive" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 blur-[120px] rounded-full" />

      <div className="relative z-10 text-center px-4">
        {/* 2. THE MAIN TITLE with a sliding animation */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-9xl font-black text-white tracking-tighter"
        >
          JOMO’S <span className="text-amber-500">BAKER</span>
        </motion.h1>

        {/* 3. THE SUBTITLE */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 text-zinc-400 text-lg md:text-xl tracking-[0.2em] uppercase font-light"
        >
          Experience Extraordinary Flavors
        </motion.p>

        {/* 4. THE ACTION BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-10"
        >
          <button className="px-10 py-4 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-900/20">
            EXPLORE THE MENU
          </button>
        </motion.div>
      </div>

      {/* 5. SCROLL INDICATOR: A little hint to tell users to look down */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 text-zinc-600 text-sm uppercase tracking-widest"
      >
        Scroll to discover
      </motion.div>
    </section>
  );
}