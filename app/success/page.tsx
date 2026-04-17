'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useCart } from '@/lib/store'; // To clear the cart after success

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('orderNumber');
  const { clearCart } = useCart();

  // Clear the cart on mount so they don't buy the same thing twice
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  if (!orderNumber) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <p className="animate-pulse">Locating your order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] text-center shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
          Order Confirmed
        </h1>
        <p className="text-zinc-500 mb-8 font-medium">
          Jomo’s Baker is now preparing your handcrafted delights.
        </p>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-8">
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">
            Order Reference
          </p>
          <p className="text-2xl font-mono text-amber-500 font-bold tracking-widest">
            {orderNumber}
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => router.push('/menu')}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
          >
            Keep Shopping <ShoppingBag className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full text-zinc-500 font-bold py-2 text-sm flex items-center justify-center gap-1 hover:text-white transition-all"
          >
            Back to Home <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}