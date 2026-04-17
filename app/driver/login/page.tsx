'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Truck, ArrowRight } from 'lucide-react';

export default function DriverLogin() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/drivers/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, action: 'login' }),
      });

      if (res.ok) {
        // Store ID for session persistence
        const data = await res.json();
        localStorage.setItem('driverPhone', phone);
        localStorage.setItem('driverId', data.driverId);
        router.push('/driver/dashboard');
      } else {
        alert("Access Denied: Number not recognized in Fleet Vault.");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
            <Truck className="text-amber-500 w-8 h-8" />
          </div>
          
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Fleet Access</h1>
            <p className="text-zinc-500 text-xs font-medium mt-2">Enter your registered phone to start shifts.</p>
          </div>

          <form onSubmit={handleStartShift} className="w-full space-y-4">
            <div className="relative">
              <input 
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                // Corrected placeholder and added length constraints
                placeholder="254 XXX XXX XXX"
                maxLength={12}
                className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-center text-xl font-bold tracking-widest placeholder:text-zinc-800 focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 py-5 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-amber-500/10"
            >
              {loading ? "Verifying..." : (
                <>
                  Start Shift <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}