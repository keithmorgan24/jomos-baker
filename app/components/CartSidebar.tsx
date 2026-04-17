'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, RotateCcw } from 'lucide-react';
import { useCart } from '@/lib/store';

export default function CartSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    onClose(); 
    router.push('/checkout'); 
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // FIXED CALCULATION LOGIC: Handles both String and Number types
  const subtotal = items.reduce((acc, item) => {
    // 1. Force the price to a string so we can safely use .replace()
    const rawPrice = String(item.price);
    
    // 2. Strip non-numeric characters (KSh, commas, etc.) and convert to float
    const price = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 0;
    
    return acc + (price * item.quantity);
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />

          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-[120] p-8 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2 text-zinc-100">
                Your Order <span className="text-amber-500">({itemCount})</span>
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-6"
                >
                  <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-zinc-800 shadow-inner">
                    <ShoppingBag className="w-10 h-10 text-zinc-600" />
                  </div>
                  <h3 className="text-2xl font-black italic text-zinc-100 mb-2 uppercase">Your bag is empty</h3>
                  <p className="text-zinc-500 mb-10 max-w-[260px] leading-relaxed">
                    It seems you haven&apos;t discovered our signature treats yet.
                  </p>
                  <button 
                    onClick={onClose}
                    className="group flex items-center gap-2 px-8 py-4 bg-amber-500 text-zinc-950 font-black italic uppercase rounded-[2rem] hover:bg-zinc-100 transition-all active:scale-95 shadow-xl shadow-amber-500/10"
                  >
                    <span>Explore Menu</span>
                  </button>
                </motion.div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    key={item.name} 
                    className="flex gap-4 items-center bg-zinc-900/40 p-4 rounded-[2rem] border border-zinc-800/50"
                  >
                    <img 
                      src={item.image} 
                      className="w-20 h-20 object-cover rounded-2xl border border-zinc-800" 
                      alt={item.name} 
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-100 uppercase text-sm tracking-widest">{item.name}</h4>
                      <p className="text-amber-500 font-mono text-xs mt-1">
  KSh {Number(item.price).toLocaleString()}
</p>
                      
                      <div className="flex items-center gap-3 bg-zinc-800/80 w-fit rounded-full p-1 border border-zinc-700/50 mt-3">
                        <button 
                          onClick={() => updateQuantity(item.name, 'minus')}
                          className="p-1 hover:bg-zinc-700 rounded-full transition-colors text-zinc-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black min-w-[20px] text-center text-zinc-100">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.name, 'plus')}
                          className="p-1 hover:bg-zinc-700 rounded-full transition-colors text-zinc-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.name)}
                      className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="border-t border-zinc-900 pt-6 mt-6 space-y-4">
                <button 
                  onClick={clearCart}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-black italic uppercase tracking-[0.2em] text-zinc-500 hover:text-red-500 border border-dashed border-zinc-800 rounded-2xl transition-all"
                >
                  <RotateCcw size={12} />
                  Clear Entire Bag
                </button>

                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="text-2xl font-black italic text-zinc-100">
                    KSh {subtotal.toLocaleString()}
                  </span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full py-5 bg-amber-500 text-zinc-950 font-black italic uppercase tracking-tighter rounded-[2.5rem] hover:bg-white transition-all shadow-xl shadow-amber-500/10 active:scale-95"
                >
                  CHECKOUT NOW
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}