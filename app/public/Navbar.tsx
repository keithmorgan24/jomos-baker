"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Added for route detection
import { ShoppingCart, Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/store'; 

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar = ({ onCartClick }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Added to prevent hydration errors
  
  const pathname = usePathname();
  const totalItems = useCart((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

  // --- HYDRATION & SCROLL SAFETY ---
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Initial check on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- HIDE LOGIC FOR DRIVER/ADMIN ---
  // This solves the double-navbar bug shown in your screenshots
  const isSpecialRoute = pathname?.startsWith('/driver') || pathname?.startsWith('/admin');

  if (!mounted || isSpecialRoute) return null;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '#menu' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-12 ${
        isScrolled ? 'h-20 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-900' : 'h-24 bg-transparent'
      } flex items-center justify-between`}
    >
      {/* --- LOGO --- */}
      <Link href="/" className="group">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-amber-500 group-hover:text-zinc-100 transition-colors">
          JOMO’S <span className="text-zinc-100 group-hover:text-amber-500">BAKER</span>
        </h1>
      </Link>

      {/* --- DESKTOP NAV --- */}
      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-amber-500 transition-all"
          >
            {link.name}
          </Link>
        ))}
        
        <Link
          href="/admin/login"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-amber-500 transition-colors border-l border-zinc-800 pl-6 ml-2"
        >
          <ShieldCheck size={14} />
          Terminal Access
        </Link>
      </div>

      {/* --- ACTIONS --- */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onCartClick}
          className="relative text-zinc-100 hover:text-amber-500 transition-colors p-2"
        >
          <ShoppingCart size={22} strokeWidth={2.5} />
          
          {totalItems > 0 && (
            <motion.span 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-0 right-0 bg-amber-500 text-zinc-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center"
            >
              {totalItems}
            </motion.span>
          )}
        </button>

        <Link 
          href="#menu"
          className="hidden sm:block bg-amber-500 text-zinc-950 px-8 py-3 rounded-full font-black italic uppercase text-sm hover:bg-zinc-100 hover:scale-105 transition-all shadow-xl shadow-amber-500/10"
        >
          Order Now
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-zinc-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-zinc-950 border-b border-zinc-900 p-8 flex flex-col gap-6 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-black italic uppercase text-zinc-100 hover:text-amber-500"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 hover:text-amber-500 transition-colors border-t border-zinc-900 pt-6"
            >
              <ShieldCheck size={14} />
              Terminal Access
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;