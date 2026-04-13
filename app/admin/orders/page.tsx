'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Truck, CheckCircle, MoreVertical, Phone } from 'lucide-react';

export default function AdminDispatch() {
  // 1. Logic: Mock database of orders and drivers
  const [orders, setOrders] = useState([
    { id: 'JB-990', customer: 'Brian O.', items: '2x Sourdough, 1x Croissant', status: 'Pending', assignedTo: null },
    { id: 'JB-989', customer: 'Linet W.', items: '4x Black Forest Slices', status: 'Baking', assignedTo: 'Evans M.' },
    { id: 'JB-991', customer: 'John D.', items: '1x Custom Birthday Cake', status: 'Pending', assignedTo: null },
  ]);

  const drivers = ['Evans M.', 'Sarah O.', 'John K.', 'Amina L.'];

  // 2. Logic: Function to handle assignment
  const handleAssign = (orderId: string, driverName: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, assignedTo: driverName, status: 'Out for Delivery' } 
        : order
    ));
    // In production, you'd trigger a push notification to the Driver's Console here
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-black italic tracking-tight text-zinc-100 uppercase">Live Dispatch</h1>
        <p className="text-zinc-500 mt-2 font-medium">Link incoming orders to active fleet members.</p>
      </header>

      <div className="grid gap-6">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div 
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={order.id}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-all"
            >
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-zinc-800 text-amber-500 font-mono text-xs font-black px-3 py-1 rounded-lg border border-zinc-700">
                    {order.id}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-100 tracking-tight">{order.customer}</h3>
                </div>
                <p className="text-zinc-500 text-sm italic font-medium">{order.items}</p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Live Status</p>
                  <div className="flex items-center gap-2 justify-end">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      order.status === 'Pending' ? 'bg-amber-500' : 
                      order.status === 'Baking' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`} />
                    <span className="text-sm font-bold text-zinc-300">{order.status}</span>
                  </div>
                </div>

                {/* Assignment Dropdown */}
                <div className="min-w-[200px]">
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1 text-right md:text-left">Assign Driver</p>
                  <select 
                    value={order.assignedTo || ''}
                    onChange={(e) => handleAssign(order.id, e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm p-4 rounded-2xl focus:border-amber-500 outline-none cursor-pointer transition-all"
                  >
                    <option value="" disabled>Select Driver...</option>
                    {drivers.map(driver => (
                      <option key={driver} value={driver}>{driver}</option>
                    ))}
                  </select>
                </div>

                {/* Quick Contact (Only if assigned) */}
                <button 
                  disabled={!order.assignedTo}
                  className={`p-4 rounded-2xl border transition-all ${
                    order.assignedTo 
                    ? 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10' 
                    : 'border-zinc-800 text-zinc-700'
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