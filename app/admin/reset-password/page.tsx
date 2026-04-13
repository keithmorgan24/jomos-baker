'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Logic: Simulate a secure reset trigger
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {!isSubmitted ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-8">
              <KeyRound className="w-8 h-8 text-amber-500" />
            </div>

            <h1 className="text-3xl font-black italic tracking-tight text-zinc-100 mb-2 uppercase">Reset Access</h1>
            <p className="text-zinc-500 font-medium text-sm mb-8">
              Enter your administrative email to receive a secure recovery link.
            </p>

            <form onSubmit={handleResetRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-2">Admin Email</label>
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jomosbaker.com"
                  className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-zinc-100 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <button 
                disabled={isLoading}
                type="submit"
                className="w-full py-5 bg-zinc-100 text-zinc-950 font-black rounded-2xl hover:bg-amber-500 hover:text-white transition-all uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Processing Request...' : 'Send Recovery Link'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-2 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
              <ShieldAlert className="w-5 h-5 text-zinc-600" />
              <p className="text-[10px] text-zinc-600 font-bold uppercase leading-relaxed">
                Recovery links expire in 15 minutes for security.
              </p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-zinc-900 border border-emerald-500/20 rounded-[3rem] p-10 text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black italic text-zinc-100 mb-4 uppercase">Check Your Inbox</h2>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
              We've sent a secure password reset link to <br/>
              <span className="text-zinc-200 font-bold">{email}</span>
            </p>
            <Link 
              href="/admin" 
              className="inline-block text-xs font-black uppercase tracking-widest text-amber-500 hover:text-white transition-colors"
            >
              Back to Login
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}