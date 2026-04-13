'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    // Artificial delay for that "Checking Database" feel
    setTimeout(() => {
      if (password === 'JomoAdmin2026') {
        localStorage.setItem('jb_admin_auth', 'true');
        router.push('/admin');
      } else {
        setError(true);
        setIsPending(false);
        setPassword(''); // Clear on fail
        setTimeout(() => setError(false), 2000);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 selection:bg-amber-500 selection:text-zinc-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-sm"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
            <ShieldCheck className={`w-8 h-8 ${isPending ? 'text-zinc-500 animate-pulse' : 'text-amber-500'}`} />
          </div>
          <h1 className="text-2xl font-black italic text-zinc-100 tracking-tight uppercase">Command Center</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Nairobi HQ • Encrypted</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${error ? 'text-red-500' : 'text-zinc-700 group-focus-within:text-amber-500'}`} />
            <input 
              type="password" 
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER ACCESS KEY"
              className={`w-full bg-zinc-950 border ${error ? 'border-red-500 animate-shake' : 'border-zinc-800'} p-5 pl-14 rounded-2xl focus:border-amber-500 outline-none text-zinc-100 transition-all font-mono tracking-widest text-sm`}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isPending}
            className="w-full group relative overflow-hidden py-5 bg-zinc-100 text-zinc-950 font-black rounded-2xl hover:bg-amber-500 hover:text-white transition-all active:scale-95 shadow-xl disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isPending ? 'AUTHENTICATING...' : 'VERIFY IDENTITY'}
              {!isPending && <ArrowRight size={18} />}
            </span>
          </button>
        </form>

        <button 
          onClick={() => router.push('/')}
          className="w-full mt-8 text-[10px] font-bold text-zinc-700 hover:text-zinc-400 uppercase tracking-[0.4em] transition-colors"
        >
          ← Return to Public Site
        </button>
      </motion.div>
    </div>
  );
}