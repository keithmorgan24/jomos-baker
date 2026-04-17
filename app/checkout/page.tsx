'use client';

import { useState } from 'react';
import { useCart, MenuItem } from '@/lib/store'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  User, 
  CheckCircle2, 
  Phone 
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [orderStep, setOrderStep] = useState<'confirmed' | 'tracking'>('confirmed');
  const { items, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Unified Price Logic: Since store.ts now provides numbers, we simplify this
  const subtotal = items.reduce((acc, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
    return acc + (price * item.quantity);
  }, 0);

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20 px-6 relative selection:bg-amber-500/30">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition-colors mb-8 group w-fit">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Return to Bakery</span>
        </Link>

        <h1 className="text-4xl font-black mb-12 italic text-zinc-100 uppercase tracking-tighter">
          Finalize Your <span className="text-amber-500">Order</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: Details & Payment */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2rem] backdrop-blur-sm">
              <h2 className="text-sm font-black mb-6 flex items-center gap-3 text-zinc-100 uppercase tracking-widest">
                <User className="text-amber-500 w-4 h-4" /> Guest Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-amber-500 outline-none text-zinc-200 md:col-span-2 text-sm font-medium transition-all" />
                <input type="email" placeholder="Email Address" className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-amber-500 outline-none text-zinc-200 md:col-span-2 text-sm font-medium transition-all" />
              </div>
            </section>

            <section className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2rem] backdrop-blur-sm">
              <h2 className="text-sm font-black mb-6 flex items-center gap-3 text-zinc-100 uppercase tracking-widest">
                <CreditCard className="text-amber-500 w-4 h-4" /> Payment Method
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {[
                  { id: 'mpesa', label: 'M-Pesa' },
                  { id: 'airtel', label: 'Airtel Money' },
                  { id: 'tkash', label: 'T-Kash' },
                  { id: 'equity', label: 'Equity Bank' },
                  { id: 'kcb', label: 'KCB Pay' },
                  { id: 'card', label: 'Visa / Master' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`py-4 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                      paymentMethod === method.id 
                      ? 'bg-amber-500 border-amber-500 text-zinc-950' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                {['mpesa', 'airtel', 'tkash'].includes(paymentMethod) ? (
                  <div className="flex items-center gap-3 px-2">
                    <span className="text-zinc-500 font-bold text-sm">+254</span>
                    <input type="tel" placeholder="700 000 000" className="w-full bg-transparent outline-none text-zinc-200 font-mono tracking-widest placeholder:text-zinc-800" />
                  </div>
                ) : (
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest text-center">Redirecting to Secure Banking Portal</p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: Summary */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900 p-8 rounded-[2.5rem] sticky top-32 border border-zinc-800 shadow-2xl">
              <h2 className="text-sm font-black mb-8 text-zinc-100 uppercase tracking-[0.3em]">Your Selection</h2>
              <div className="space-y-6 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-zinc-100 uppercase tracking-tight">{item.name}</span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-zinc-300">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-800 pt-8">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Total Amount</span>
                  <span className="text-3xl font-black text-amber-500 italic tracking-tighter">
                    KSh {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing || items.length === 0}
                className="w-full py-6 bg-zinc-100 text-zinc-950 font-black rounded-2xl mt-10 hover:bg-amber-500 transition-all disabled:opacity-20 shadow-xl active:scale-95 uppercase tracking-widest text-xs"
              >
                {isProcessing ? 'Authorizing...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL & RECEIPT */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.1)]"
            >
              {orderStep === 'confirmed' ? (
                <div className="p-10 text-center">
                  <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                    <CheckCircle2 className="w-12 h-12 text-amber-500" />
                  </div>
                  <h2 className="text-3xl font-black text-zinc-100 italic uppercase tracking-tighter mb-2">Signature Confirmed</h2>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">We&apos;re getting your treats ready</p>

                  <div className="bg-zinc-950/50 rounded-2xl p-6 border border-zinc-800/50 mb-8 text-left">
                    <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">
                      <span>Receipt #JB-772</span>
                      <span>{paymentMethod}</span>
                    </div>
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item._id} className="flex justify-between text-xs">
                          <span className="text-zinc-400 font-medium">{item.quantity}x {item.name}</span>
                          <span className="text-zinc-100 font-mono font-bold">{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setOrderStep('tracking')}
                    className="w-full py-5 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-500 transition-all shadow-lg italic uppercase tracking-widest text-xs"
                  >
                    Track My Delivery →
                  </button>
                </div>
              ) : (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-10">
                  <h2 className="text-xl font-black text-zinc-100 mb-10 italic uppercase tracking-tighter">Live Status</h2>
                  
                  <div className="relative space-y-8 mb-12 ml-4">
                    <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-zinc-800" />
                    {[
                      { label: 'Order Confirmed', time: 'Just now', done: true },
                      { label: 'Baking Excellence', time: 'In Oven', done: true },
                      { label: 'Courier Dispatched', time: 'Transit', done: false },
                      { label: 'Delivered', time: 'Awaiting', done: false }
                    ].map((step, i) => (
                      <div key={i} className="relative pl-8">
                        <div className={`absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full ${step.done ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'bg-zinc-800'}`} />
                        <p className={`text-xs font-black uppercase tracking-tight ${step.done ? 'text-zinc-100' : 'text-zinc-700'}`}>{step.label}</p>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{step.time}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-[2rem] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center font-black text-amber-500 border border-zinc-800 text-lg">
                        E
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Verified Courier</p>
                        <p className="text-zinc-100 font-black text-sm uppercase">Evans M.</p>
                      </div>
                    </div>
                    <a href="tel:+254700000000" className="w-12 h-12 bg-amber-500 text-zinc-950 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
                      <Phone className="w-5 h-5" />
                    </a>
                  </div>

                  <button 
                    onClick={() => { setShowSuccess(false); clearCart(); }}
                    className="w-full mt-10 py-4 text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] hover:text-amber-500 transition-colors"
                  >
                    Dismiss Tracker
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}