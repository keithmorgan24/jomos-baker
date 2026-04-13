'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Shield, Phone, UserPlus, X, Trash2, ShieldCheck, Smartphone } from 'lucide-react';

export default function FleetManagement() {
  // 1. State for the driver list
  const [drivers, setDrivers] = useState([
    { id: 'D1', name: 'Evans M.', phone: '+254712345678', location: 'Westlands', orders: 12, verified: true },
    { id: 'D2', name: 'Sarah O.', phone: '+254722345678', location: 'Kilimani', orders: 8, verified: true },
  ]);

  // 2. State for UI and Form Data
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [newDriver, setNewDriver] = useState({ 
    name: '', 
    location: '', 
    phone: '' 
  });

  // 3. The Functional Logic: Real API Integration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.location || !newDriver.phone) return;

    setIsSendingSms(true);

    try {
      // Logic: Send request to your Backend API route
      const response = await fetch('/api/verify-driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: newDriver.phone,
          name: newDriver.name,
          location: newDriver.location
        }),
      });

      if (response.ok) {
        // Logic: Add to list as "Unverified" until they enter the code
        const driverEntry = {
          id: `D${drivers.length + 1}`,
          ...newDriver,
          orders: 0,
          verified: false,
        };

        setDrivers([...drivers, driverEntry]);
        setShowRegisterModal(false);
        setNewDriver({ name: '', location: '', phone: '' });
        alert(`Success! A real verification code has been dispatched to ${newDriver.phone}`);
      } else {
        throw new Error('Verification failed to send');
      }
    } catch (err) {
      console.error("SMS Error:", err);
      alert("Connectivity Issue: Please ensure your API route is configured.");
    } finally {
      setIsSendingSms(false);
    }
  };

  // 4. Functional Logic: Suspend Driver
  const handleSuspend = (id: string) => {
    setDrivers(drivers.filter(d => d.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 relative">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight text-zinc-100 uppercase text-amber-500">Fleet Control</h1>
          <p className="text-zinc-500 mt-2 font-medium italic">Verified Delivery Network</p>
        </div>
        <button 
          onClick={() => setShowRegisterModal(true)}
          className="bg-zinc-100 text-zinc-950 font-black px-6 py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Register & Verify
        </button>
      </header>

      {/* Driver Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {drivers.map((driver) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={driver.id}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] relative group hover:border-zinc-700 transition-all shadow-xl"
            >
              {/* Verification Badge */}
              <div className="absolute top-6 right-8">
                {driver.verified ? (
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase tracking-tighter bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 animate-pulse">
                    <Smartphone className="w-3 h-3" /> Pending SMS
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 text-2xl font-black text-amber-500">
                  {driver.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-100">{driver.name}</h3>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    {driver.phone}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-2xl border border-zinc-800 mb-8 shadow-inner">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                  <MapPin className="w-4 h-4 text-amber-500" /> {driver.location}
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                  <Shield className="w-4 h-4 text-blue-500" /> {driver.orders} Orders
                </div>
              </div>

              <div className="flex gap-3">
                <a 
                  href={`tel:${driver.phone}`} 
                  className="flex-1 py-4 bg-zinc-800 text-zinc-100 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" /> CONTACT
                </a>
                <button 
                  onClick={() => handleSuspend(driver.id)}
                  className="px-6 py-4 bg-zinc-950 border border-zinc-800 text-zinc-500 rounded-2xl hover:text-red-500 hover:border-red-500/50 transition-all active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* REGISTRATION MODAL */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-xl font-bold italic tracking-tight">New Fleet Entry</h2>
                <button onClick={() => setShowRegisterModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X />
                </button>
              </div>
              
              <form onSubmit={handleRegister} className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Driver Full Name</label>
                  <input required type="text" value={newDriver.name} onChange={(e) => setNewDriver({...newDriver, name: e.target.value})} placeholder="Full Name" className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-amber-500 outline-none text-zinc-100 transition-all placeholder:text-zinc-700" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Phone Number</label>
                  <input required type="tel" value={newDriver.phone} onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})} placeholder="+254..." className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-amber-500 outline-none text-zinc-100 transition-all placeholder:text-zinc-700" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Base Location</label>
                  <input required type="text" value={newDriver.location} onChange={(e) => setNewDriver({...newDriver, location: e.target.value})} placeholder="Location" className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-amber-500 outline-none text-zinc-100 transition-all placeholder:text-zinc-700" />
                </div>
                <button 
                  disabled={isSendingSms}
                  type="submit" 
                  className="w-full py-5 bg-amber-500 text-zinc-950 font-black rounded-2xl hover:bg-white transition-all uppercase tracking-widest text-xs shadow-lg shadow-amber-500/10 disabled:opacity-50"
                >
                  {isSendingSms ? 'SENDING VERIFICATION...' : 'AUTHORIZE & SEND SMS'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}