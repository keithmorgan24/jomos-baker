'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, MapPin } from 'lucide-react';

export default function AdminDashboard() {
  // 1. State for Stat Cards
  const [statsData, setStatsData] = useState({
    revenue: 0,
    activeOrders: 0,
    fleetOnline: 0
  });

  // 2. State for the Recent Orders Table
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // 3. Fetching Data from your API
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch calculations for the cards
        const statsRes = await fetch('/api/admin/stats');
        const sData = await statsRes.json();
        setStatsData(sData);

        // Fetch the 5 most recent orders for the table
        const ordersRes = await fetch('/api/orders?limit=5');
        const oData = await ordersRes.json();
        setRecentOrders(oData);
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      }
    }

    fetchDashboardData();
    
    // Auto-refresh every 30 seconds to keep the "Command Center" live
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 4. Transforming raw data into UI-ready card objects
  const statCards = [
    {
      label: "Today's Revenue",
      value: `KSh ${statsData.revenue.toLocaleString()}`,
      icon: TrendingUp,
      bg: 'bg-emerald-500/10',
      color: 'text-emerald-500'
    },
    {
      label: 'Active Orders',
      value: statsData.activeOrders,
      icon: Package,
      bg: 'bg-amber-500/10',
      color: 'text-amber-500'
    },
    {
      label: 'Fleet Online',
      value: statsData.fleetOnline,
      icon: Users,
      bg: 'bg-blue-500/10',
      color: 'text-blue-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
<header className="flex justify-between items-end">
  <div>
    <h1 className="text-4xl font-black italic tracking-tight text-zinc-100 uppercase">Dashboard</h1>
    <p className="text-zinc-500 mt-2 font-medium flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      System operational. 
    </p>
  </div>
  
</header>
      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
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

      {/* Secondary Grid: Orders & Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
            <h2 className="text-xl font-bold italic tracking-tight">Recent Orders</h2>
            <button className="text-xs font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors">View All</button>
          </div>
          <div className="p-4 overflow-x-auto">
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
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group">
                      <td className="p-4 font-mono text-amber-500 font-bold">#{order.orderNumber || order._id.slice(-5)}</td>
                      <td className="p-4 text-zinc-300 font-bold">{order.customer?.name || "Guest User"}</td>
                      <td className="p-4 text-zinc-400 font-medium">KSh {order.totalAmount?.toLocaleString() || '0'}</td>
                      <td className="p-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${
                          order.status === 'pending' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                          order.status === 'baking' ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' :
                          'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-600 italic">No orders found today.</td>
                  </tr>
                )}
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
                <p className="text-sm font-bold text-zinc-200">Active Fleet</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Monitoring Live Units</p>
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