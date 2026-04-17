"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UtensilsCrossed, 
  ClipboardList, 
  Globe 
} from 'lucide-react';

const AdminNavbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Overview', href: '/admin', icon: <LayoutDashboard size={14} /> },
    { name: 'Fleet', href: '/admin/fleet', icon: <Users size={14} /> },
    { name: 'Menu Editor', href: '/admin/menu', icon: <UtensilsCrossed size={14} /> },
    { name: 'Orders', href: '/admin/orders', icon: <ClipboardList size={14} /> },
  ];

  return (
    <nav className="h-20 bg-zinc-950 border-b border-zinc-900 px-8 flex items-center justify-between sticky top-0 z-[60] backdrop-blur-md bg-zinc-950/90">
      <div className="flex items-center gap-12">
        <Link href="/admin" className="group">
          <span className="text-amber-500 font-black italic text-xl tracking-tighter uppercase transition-colors group-hover:text-zinc-100">
            {/* Fixed: Used &apos; to satisfy ESLint rule react/no-unescaped-entities */}
            JOMO&apos;S BAKER
          </span>
          <span className="text-zinc-600 text-[10px] ml-3 uppercase font-bold tracking-[0.3em]">
            Admin
          </span>
        </Link>

        {/* Functional Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive 
                    ? 'text-amber-500' 
                    : 'text-zinc-500 hover:text-zinc-100'
                }`}
              >
                <span className={isActive ? 'text-amber-500' : 'text-zinc-600'}>
                  {link.icon}
                </span>
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/" 
          className="group flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-black text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all uppercase tracking-widest shadow-2xl"
        >
          <Globe size={12} className="text-zinc-600 group-hover:text-amber-500 transition-colors" />
          View Live Site
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;