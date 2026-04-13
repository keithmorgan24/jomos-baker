'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Menu } from 'lucide-react';

// We added { onCartClick } here so the Layout can control it
export default function Navbar({ onCartClick }: { onCartClick: () => void }) {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-zinc-950/70 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black text-amber-500 tracking-tighter cursor-pointer"
        >
          JOMO'S BAKER
        </motion.div>

        <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest">
          <a href="#" className="hover:text-amber-500 transition-colors">Home</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Menu</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Services</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Contact</a>
        </div>

        <div className="flex gap-5 items-center">
          {/* NOTICE: We added onClick={onCartClick} here! */}
          <ShoppingCart 
            onClick={onCartClick} 
            className="w-5 h-5 cursor-pointer hover:text-amber-500 transition-colors" 
          />
          <Menu className="w-6 h-6 md:hidden cursor-pointer" />
          <button className="hidden md:block bg-amber-600 px-5 py-2 rounded-full text-xs font-bold hover:bg-amber-500 transition-all">
            ORDER NOW
          </button>
        </div>
        
      </div>
    </nav>
  );
}