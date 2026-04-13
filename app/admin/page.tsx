'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, MapPin } from 'lucide-react';

export default function AdminDashboard() {
  // Logic: Temporary mock data for the dashboard
  const stats = [
    { label: 'Today\'s Revenue', value: 'KSh 18,400', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Orders', value: '12', icon: Package, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Fleet Online', value: '5', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  const recentOrders = [
    { id: '#JB-990', customer: 'Brian O.', total: 'KSh 1,200', status: 'Pending' },
    { id: '#JB-989', customer: 'Linet W.', total: 'KSh 3,450', status: 'Baking' },
    { id: '#JB-988', customer: 'David K.', total: 'KSh 850', status: 'Delivered' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight text-zinc-100">DASHBOARD</h1>
          <p className="text-zinc-500 mt-2 font-medium">System operational. All nodes synced.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Current Session</p>
          <p className="text-zinc-100 font-mono text-sm">2026.04.13 // 20:15</p>
        </div>
      </header>

      {/* 1. Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] hover:border-zinc-700 transition-all group"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 border border-white/5`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-zinc-100 tracking-tighter italic">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 2. Recent Activity & Fleet Map Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
            <h2 className="text-xl font-bold italic tracking-tight">Recent Orders</h2>
            <button className="text-xs font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors">View All</button>
          </div>
          <div className="p-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-zinc-600 text-[10px] font-black uppercase tracking-widest border-b border-zinc-800">
                  <th className="p-4">ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group">
                    <td className="p-4 font-mono text-amber-500 font-bold">{order.id}</td>
                    <td className="p-4 text-zinc-300 font-bold">{order.customer}</td>
                    <td className="p-4 text-zinc-400 font-medium">{order.total}</td>
                    <td className="p-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                        order.status === 'Pending' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                        order.status === 'Baking' ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' :
                        'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mini Fleet Widget */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8">
          <h2 className="text-xl font-bold italic mb-6">Fleet Pulse</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 bg-zinc-800 rounded-full border border-zinc-700" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-zinc-900 rounded-full" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-200">Evans M.</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Active // Near Westlands</p>
              </div>
            </div>
            <div className="h-[200px] bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
               <MapPin className="text-zinc-800 group-hover:text-amber-500/20 transition-colors w-12 h-12" />
               <p className="absolute bottom-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Map Engine Idle</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}