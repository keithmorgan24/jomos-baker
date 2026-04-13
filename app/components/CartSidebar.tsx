'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../lib/store';

export default function CartSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { items, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  // 1. Navigation Logic
  const handleCheckout = () => {
    onClose(); 
    router.push('/checkout'); 
  };

  // 2. Calculation Logic
  const itemCount = items.reduce((total: number, item: any) => total + item.quantity, 0);

  const subtotal = items.reduce((acc: number, item: any) => {
    const price = parseFloat(item.price.replace('$', ''));
    return acc + (price * item.quantity);
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-[70] p-8 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-zinc-100">
                Your Order ({itemCount}) <ShoppingBag className="text-amber-500 w-6 h-6" />
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
                  <h3 className="text-2xl font-bold text-zinc-100 mb-2 italic">Your cart is empty</h3>
                  <p className="text-zinc-500 mb-10 max-w-[260px] leading-relaxed">
                    It seems you haven't discovered our signature treats yet.
                  </p>
                  <button 
                    onClick={onClose}
                    className="group relative flex items-center gap-2 px-8 py-4 bg-zinc-100 text-zinc-950 font-bold rounded-2xl hover:bg-amber-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
                  >
                    <span>Explore Menu</span>
                    <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:bg-white transition-colors" />
                  </button>
                </motion.div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    key={item.name} 
                    className="flex gap-4 items-center bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50"
                  >
                    <img 
                      src={item.image} 
                      className="w-20 h-20 object-cover rounded-xl border border-zinc-800" 
                      alt={item.name} 
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-100">{item.name}</h4>
                      <p className="text-amber-500 text-sm mb-3">{item.price}</p>
                      
                      <div className="flex items-center gap-3 bg-zinc-800/80 w-fit rounded-lg p-1 border border-zinc-700/50">
                        <button 
                          onClick={() => updateQuantity(item.name, 'minus')}
                          className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-400 hover:text-amber-500"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-mono font-bold min-w-[24px] text-center text-zinc-100">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.name, 'plus')}
                          className="p-1 hover:bg-zinc-700 rounded transition-colors text-zinc-400 hover:text-amber-500"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.name)}
                      className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="border-t border-zinc-800 pt-6 mt-6">
                <div className="flex justify-between items-center mb-6 px-1">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-xl font-bold text-zinc-100">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/20 active:scale-[0.98]"
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