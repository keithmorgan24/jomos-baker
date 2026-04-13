'use client';

import Hero from './components/Hero';
import { motion } from 'framer-motion';
import { MENU_ITEMS } from '../lib/menu';
import { useCart } from '../lib/store'; 

export default function Home() {
  // 1. Destructure both actions from the store
  const { addItem, showToast } = useCart();

  return (
    <main className="bg-zinc-950">
      <Hero />

      <div className="py-20 px-6 w-full max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center italic text-amber-500">
          Our Signature Selection
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MENU_ITEMS.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800"
            >
              <div className="h-64 w-full overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                  {item.category}
                </span>
                <h3 className="text-2xl font-bold mt-1 text-zinc-100 italic">
                  {item.name}
                </h3>
                <p className="text-zinc-500 mt-2">{item.price}</p>
                
                {/* 2. The Button now triggers the Toast Brain! */}
                <button 
                  onClick={() => {
                    addItem(item);
                    // 3. Replaced alert with our premium showToast function
                    showToast(`${item.name} added to cart! 🥐`); 
                  }}
                  className="mt-4 w-full py-3 bg-zinc-800 rounded-xl font-bold hover:bg-amber-600 transition-all active:scale-95 text-zinc-100"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}