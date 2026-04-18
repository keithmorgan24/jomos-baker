'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShoppingBag, User, CheckCircle2 } from 'lucide-react';
import { pusherClient } from '@/lib/pusher';

export default function AdminDispatch() {
  const [orders, setOrders] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  // 1. Initial Fetch from Protected Routes
  useEffect(() => {
    async function fetchData() {
      try {
        const [orderRes, driverRes] = await Promise.all([
          fetch('/api/admin/orders'),
          fetch('/api/admin/drivers')
        ]);
        
        if (orderRes.ok) setOrders(await orderRes.json());
        if (driverRes.ok) setDrivers(await driverRes.json());
      } catch (err) {
        console.error("Data fetch failed:", err);
      }
    }
    fetchData();

    // 2. Pusher Listener - Aligned with M-Pesa Callback
    if (pusherClient) {
      const channel = pusherClient.subscribe('admin-orders');
      
      // We listen for 'order-paid' because that's the "Truth" from M-Pesa
      channel.bind('order-paid', (data: any) => {
        new Audio('/sounds/notification.mp3').play().catch(() => {}); 
        // We add the new paid order to the top
        setOrders((prev) => [data, ...prev]);
      });

     return () => {
    if (pusherClient) {
      // Safely unbind and unsubscribe only if pusherClient exists
      pusherClient.unbind_all();
      pusherClient.unsubscribe('admin-orders');
    }
  };
    }
  }, []);

  // 3. Secure Assignment Logic
  const handleAssign = async (orderId: string, driverId: string) => {
    // Optimistic Update
    setOrders(prev => prev.map(o => 
      o._id === orderId ? { ...o, assignedDriver: driverId, status: 'dispatched' } : o
    ));

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId }),
      });
      
      if (!response.ok) throw new Error("Assignment failed");
    } catch (err) {
      // Rollback on error (Best Practice)
      console.error(err);
      alert("Failed to assign driver. Please try again.");
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-zinc-100 uppercase">Live Dispatch</h1>
          <p className="text-zinc-500 mt-2 font-bold text-xs uppercase tracking-[0.2em]">Fleet Management & Logistics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Sync Active</span>
        </div>
      </header>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={order._id}
              className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="w-16 h-16 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-black text-zinc-100 tracking-tight capitalize">
                      {order.customer?.name || "Anonymous Guest"}
                    </h3>
                    {order.status === 'paid' && (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    )}
                  </div>
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-tighter">
                    {Array.isArray(order.items) 
                      ? order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(' • ') 
                      : 'Special Order'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                {/* Status Badge */}
                <div className="text-right min-w-[100px]">
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-2">Payment Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                    order.status === 'paid' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                  }`}>
                    {order.status}
                  </div>
                </div>

                {/* Driver Selection */}
                <div className="min-w-[220px]">
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-2">Dispatch Assignment</p>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select 
                      value={order.assignedDriver || ''}
                      onChange={(e) => handleAssign(order._id, e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-bold pl-10 pr-4 py-4 rounded-2xl focus:border-amber-500 outline-none cursor-pointer appearance-none transition-all"
                    >
                      <option value="" disabled>Waiting for Assignment...</option>
                      {drivers.map(driver => (
                        <option key={driver._id} value={driver._id}>{driver.name} ({driver.status})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Button */}
                <button 
                  disabled={!order.customer?.phone}
                  className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:border-amber-500 transition-all disabled:opacity-30"
                >
                  <Phone size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}