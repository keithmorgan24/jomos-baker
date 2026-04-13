
'use client';

import { useState } from 'react';
import { useCart } from '../../lib/store'; 
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CreditCard, Truck, MessageSquare, User, CheckCircle2, Download, Printer } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [orderStep, setOrderStep] = useState('confirmed'); // 'confirmed' -> 'tracking'
  const { items, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = items.reduce((acc: number, item: any) => {
    const price = parseFloat(item.price.replace('$', ''));
    return acc + (price * item.quantity);
  }, 0);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Logic: Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition-colors mb-8 group w-fit">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Bakery</span>
        </Link>

        <h1 className="text-4xl font-bold mb-12 italic text-zinc-100">Finalize Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: Details & Payment */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-3xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-zinc-100">
                <User className="text-amber-500 w-5 h-5" /> Guest Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-amber-500 outline-none text-zinc-200 md:col-span-2" />
                <input type="email" placeholder="Email Address" className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-amber-500 outline-none text-zinc-200 md:col-span-2" />
              </div>
            </section>

            <section className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-3xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-zinc-100">
                <CreditCard className="text-amber-500 w-5 h-5" /> Payment Method
              </h2>
              
              {/* Kenyan Payment Suite */}
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
                    className={`py-3 rounded-xl border font-bold text-xs transition-all ${
                      paymentMethod === method.id 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                {['mpesa', 'airtel', 'tkash'].includes(paymentMethod) ? (
                  <input type="tel" placeholder="Mobile Money Number (07...)" className="w-full bg-transparent outline-none text-zinc-200 placeholder:text-zinc-600" />
                ) : (
                  <p className="text-zinc-500 text-sm italic">You will be redirected to the secure banking portal.</p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: Summary */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900 p-8 rounded-3xl sticky top-32 border border-zinc-800 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-zinc-100">Summary</h2>
              <div className="space-y-4 mb-8 max-h-40 overflow-y-auto custom-scrollbar">
                {items.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span className="text-zinc-400">{item.quantity}x {item.name}</span>
                    <span className="text-zinc-100 font-medium">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-800 pt-6 space-y-4">
                <div className="flex justify-between text-2xl font-bold text-zinc-100 italic">
                  <span>Total</span>
                  <span className="text-amber-500">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing || items.length === 0}
                className="w-full py-5 bg-zinc-100 text-zinc-950 font-black rounded-2xl mt-8 hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50"
              >
                {isProcessing ? 'PROCESSING...' : 'PLACE ORDER'}
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
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        {orderStep === 'confirmed' ? (
          /* SECTION A: Order Confirmation & Receipt */
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                <CheckCircle2 className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-3xl font-black text-zinc-100 italic">PAYMENT SUCCESS!</h2>
              <p className="text-zinc-500 text-sm mt-2">Your signature treats are being prepared.</p>
            </div>

            <div className="bg-zinc-950/50 rounded-2xl p-6 border border-zinc-800/50 mb-8">
              <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-tighter mb-4">
                <span>Receipt #JB-772</span>
                <span>{paymentMethod.toUpperCase()}</span>
              </div>
              <div className="space-y-2 border-t border-zinc-900 pt-4">
                {items.map(item => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span className="text-zinc-400">{item.quantity}x {item.name}</span>
                    <span className="text-zinc-200 font-mono">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setOrderStep('tracking')}
              className="w-full py-5 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/20 italic"
            >
              TRACK MY DELIVERY →
            </button>
          </div>
        ) : (
          /* SECTION B: Live Order Tracking & Driver Details */
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-8">
            <h2 className="text-2xl font-bold text-zinc-100 mb-8 italic">Track Order</h2>
            
            {/* Progress Tracker */}
            <div className="relative space-y-8 mb-10 ml-4">
              <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-zinc-800" />
              {[
                { label: 'Order Confirmed', time: 'Just now', done: true },
                { label: 'Baking in Progress', time: 'Est. 15 mins', done: true },
                { label: 'On the Way', time: 'In Transit', done: false },
                { label: 'Delivered', time: 'Awaiting', done: false }
              ].map((step, i) => (
                <div key={i} className="relative pl-8">
                  <div className={`absolute left-[-5px] top-1 w-3 h-3 rounded-full ${step.done ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-zinc-800'}`} />
                  <p className={`text-sm font-bold ${step.done ? 'text-zinc-100' : 'text-zinc-600'}`}>{step.label}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{step.time}</p>
                </div>
              ))}
            </div>

            {/* Driver Contact Card */}
            <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-amber-500 border border-zinc-700">
                  E
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Your Courier</p>
                  <p className="text-zinc-100 font-bold">Evans M. (Verified)</p>
                </div>
              </div>
              <a 
                href="tel:+254700000000" 
                className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-white transition-all"
              >
                <Truck className="w-5 h-5" />
              </a>
            </div>

            <button 
              onClick={() => { setShowSuccess(false); clearCart(); }}
              className="w-full mt-8 py-4 text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-zinc-300 transition-colors"
            >
              Close Tracker
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