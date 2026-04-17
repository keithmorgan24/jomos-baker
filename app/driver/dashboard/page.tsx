'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, MapPin, Power, Navigation, Clock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DriverDashboard() {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [driverPhone, setDriverPhone] = useState<string | null>(null);
  const router = useRouter();

  const DELIVERY_FEE = 350;

  // --- STEP 1: AUTH CHECK ---
  useEffect(() => {
    // Get the phone number that was typed during login
    const savedPhone = localStorage.getItem('driverPhone');
    if (!savedPhone) {
      router.push('/driver/login');
    } else {
      setDriverPhone(savedPhone);
    }
  }, [router]);

  // --- STEP 2: DYNAMIC STATS ---
  const stats = useMemo(() => {
    const completed = allOrders.filter((o: any) => o.status === 'delivered');
    return {
      count: completed.length,
      earnings: completed.length * DELIVERY_FEE
    };
  }, [allOrders]);

  const activeTasks = allOrders.filter((o: any) => o.status !== 'delivered');

  // --- STEP 3: DYNAMIC DATA FETCH ---
  const fetchOrders = async () => {
    if (!driverPhone) return;
    try {
      const res = await fetch(`/api/orders/assigned?phone=${driverPhone}`);
      if (res.ok) {
        const data = await res.json();
        setAllOrders(data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (driverPhone) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 20000);
      return () => clearInterval(interval);
    }
  }, [driverPhone]);

  const handleNavigation = (address: string) => {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleComplete = async (orderId: string) => {
    try {
      const res = await fetch('/api/orders/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'delivered' }),
      });

      if (res.ok) {
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchOrders();
      }
    } catch (err) {
      console.error("Completion Error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('driverPhone');
    router.push('/driver/login');
  };

  if (loading || !driverPhone) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 pb-20 font-sans">
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className="fixed top-6 left-4 right-4 bg-emerald-500 text-zinc-950 p-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] z-50 shadow-2xl">
            <CheckCircle className="w-4 h-4" /> Earnings Updated
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl text-center">
          <p className="text-[9px] font-black uppercase text-zinc-500 mb-1 tracking-widest">Earnings</p>
          <p className="text-xl font-black text-amber-500 italic">KES {stats.earnings.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl text-center">
          <p className="text-[9px] font-black uppercase text-zinc-500 mb-1 tracking-widest">Delivered</p>
          <p className="text-xl font-black italic">{stats.count}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8 bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2.5rem]">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Driver Mode</h2>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">ID: {driverPhone}</p>
        </div>
        <button onClick={handleLogout} className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20">
          <Power className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="px-4 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Active Tasks</h3>
        <AnimatePresence mode="popLayout">
          {activeTasks.length > 0 ? (
            activeTasks.map((order: any) => (
              <motion.div key={order._id} layout initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 text-amber-500">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase">Order #{order._id.slice(-4)}</p>
                      <p className="text-lg font-bold">Bakery Delivery</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-amber-500 text-zinc-950 px-3 py-1 rounded-full uppercase italic">
                    {order.status}
                  </span>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-zinc-600 shrink-0" />
                  <p className="font-medium text-zinc-300 italic">{order.customerAddress || "Nairobi"}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleNavigation(order.customerAddress)} className="bg-zinc-800 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Nav</button>
                  <button onClick={() => handleComplete(order._id)} className="bg-zinc-100 text-zinc-950 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Complete</button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-700 border-2 border-dashed border-zinc-900 rounded-[2.5rem]">
              <Clock className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest">No active tasks</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}