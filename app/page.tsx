'use client';

import { motion } from 'framer-motion';
import Hero from './components/Hero';
// Logic: We no longer import the static MENU_ITEMS array.
// Instead, we import the MenuItem type for safety.
import { MenuItem } from '../lib/menu';
import { useCart } from '../lib/store';
import Image from 'next/image';

export default function Home() {
  // Logic: Subscribe to the SHARED menu state from the store.
  // When Admin updates 'menu' in the store, this page re-renders automatically.
  const menu = useCart((state) => state.menu);
  const addItem = useCart((state) => state.addItem);

  return (
    <main className="bg-zinc-950 min-h-screen">
      <Hero />

      <div className="py-20 px-6 w-full max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center italic text-amber-500">
          Our Signature Selection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menu.map((item: MenuItem, index: number) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all"
            >
              <div className="h-64 w-full overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md px-4 py-1 rounded-full border border-white/10">
                  <span className="text-xs font-black text-amber-500 tracking-widest uppercase">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-zinc-100 uppercase italic leading-tight">
                    {item.name}
                  </h3>
                  <span className="text-amber-500 font-mono font-bold">
                    {item.price}
                  </span>
                </div>
                
                <button 
                  onClick={() => addItem(item)}
                  className="w-full py-4 bg-zinc-100 text-zinc-950 font-black rounded-xl hover:bg-amber-500 hover:text-white transition-all active:scale-95"
                >
                  ADD TO BAG
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}