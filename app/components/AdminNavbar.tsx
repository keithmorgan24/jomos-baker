// components/AdminNavbar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UtensilsCrossed, ClipboardList, LogOut } from 'lucide-react';

const AdminNavbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Overview', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Fleet', href: '/admin/fleet', icon: <Users size={18} /> },
    { name: 'Menu Editor', href: '/admin/menu', icon: <UtensilsCrossed size={18} /> },
    { name: 'Orders', href: '/admin/orders', icon: <ClipboardList size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-zinc-950 border-b border-zinc-900 z-[100] px-8 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Link href="/admin" className="text-amber-500 font-black italic text-xl tracking-tighter">
          JOMO'S BAKER <span className="text-zinc-500 text-xs ml-2 uppercase font-mono tracking-widest">Admin</span>
        </Link>

        {/* Corrected Functional Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all ${
                pathname === link.href ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-100'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/" 
          className="px-4 py-2 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-400 hover:bg-zinc-900 transition-all uppercase tracking-widest"
        >
          View Live Site
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;