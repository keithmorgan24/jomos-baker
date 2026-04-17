'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone } from 'lucide-react';
import { pusherClient } from '@/lib/pusher'; // Ensure this is implemented

export default function AdminDispatch() {
  // 1. Logic: State for Real Data
  const [orders, setOrders] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]); // Should be fetched from /api/drivers

  // 2. Initial Fetch
  useEffect(() => {
  async function fetchData() {
    const orderRes = await fetch('/api/orders');
    const orderData = await orderRes.json();
    setOrders(orderData);

    const driverRes = await fetch('/api/drivers');
    const driverData = await driverRes.json();
    setDrivers(driverData);
  }
  fetchData();

  // 3. Pusher Listener with "Safety Check"
  // The '?' ensures we don't crash if pusherClient is null
 if (pusherClient) {
    const channel = pusherClient.subscribe('admin-orders');
    channel.bind('new-order', (newOrder: any) => {
      new Audio('/notification.mp3').play().catch(() => {}); 
      setOrders((prev) => [newOrder, ...prev]);
    });
  } // <--- This closes the 'if', NOT the useEffect

  return () => {
    if (pusherClient) {
      pusherClient.unsubscribe('admin-orders');
    }
  };
}, []);

  // 4. Logic: Persistent Assignment
  const handleAssign = async (orderId: string, driverId: string) => {
    // Optimistic Update UI
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, assignedDriver: driverId, status: 'dispatched' } : o));

    // Save to Database
    await fetch(`/api/orders/${orderId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ driverId }),
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6">
      <header>
        <h1 className="text-4xl font-black italic tracking-tight text-zinc-100 uppercase">Live Dispatch</h1>
        <p className="text-zinc-500 mt-2 font-medium">Link incoming orders to active fleet members.</p>
      </header>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={order._id || order.orderNumber}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-zinc-800 text-amber-500 font-mono text-xs font-black px-3 py-1 rounded-lg border border-zinc-700">
                    {order.orderNumber || order.id}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
                    {order.customer?.name || order.customer}
                  </h3>
                </div>
                <p className="text-zinc-500 text-sm italic font-medium">
                  {Array.isArray(order.items) ? order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ') : order.items}
                </p>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Live Status</p>
                  <div className="flex items-center gap-2 justify-end">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      order.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <span className="text-sm font-bold text-zinc-300 capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="min-w-[200px]">
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Assign Driver</p>
                  <select 
                    value={order.assignedDriver || ''}
                    onChange={(e) => handleAssign(order._id, e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm p-4 rounded-2xl focus:border-amber-500 outline-none cursor-pointer"
                  >
                    <option value="" disabled>Select Driver...</option>
                    {drivers.map(driver => (
                      <option key={driver._id} value={driver._id}>{driver.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  disabled={!order.assignedDriver}
                  className={`p-4 rounded-2xl border transition-all ${
                    order.assignedDriver ? 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10' : 'border-zinc-800 text-zinc-700'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}