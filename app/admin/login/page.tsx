'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic: For now, we use a simple hardcoded key. 
    // In production, this would hit your Django /auth endpoint.
    if (password === 'JomoAdmin2026') {
      // Logic: Setting a simple flag in localStorage to "remember" login
      localStorage.setItem('jb_admin_auth', 'true');
      router.push('/admin');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
            <ShieldCheck className="text-amber-500 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black italic text-zinc-100 tracking-tight">COMMAND CENTER</h1>
          <p className="text-zinc-500 text-sm mt-2">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Key"
              className={`w-full bg-zinc-950 border ${error ? 'border-red-500' : 'border-zinc-800'} p-5 pl-12 rounded-2xl focus:border-amber-500 outline-none text-zinc-100 transition-all`}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-5 bg-zinc-100 text-zinc-950 font-black rounded-2xl hover:bg-amber-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            VERIFY IDENTITY
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-6 text-xs font-bold uppercase tracking-widest animate-bounce">
            Access Denied
          </p>
        )}
      </motion.div>
    </div>
  );
}