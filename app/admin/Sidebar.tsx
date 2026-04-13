'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Utensils, 
  Home, 
  KeyRound, 
  LogOut 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Command Center', href: '/admin', icon: LayoutDashboard },
    { name: 'Fleet Control', href: '/admin/fleet', icon: Users },
    { name: 'Menu Vault', href: '/admin/menu', icon: Utensils },
    { name: 'Reset Access', href: '/admin/reset-password', icon: KeyRound },
  ];

  return (
    <aside className="w-72 h-screen bg-zinc-950 border-r border-zinc-900 p-8 flex flex-col fixed left-0 top-0">
      <div className="mb-12 px-4">
        <h2 className="text-2xl font-black italic tracking-tighter text-amber-500">JOMO'S BAKER</h2>
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Management Suite</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              pathname === item.href 
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/10' 
              : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="pt-8 border-t border-zinc-900 space-y-2">
        <Link 
          href="/" 
          className="flex items-center gap-4 px-6 py-4 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
        >
          <Home className="w-4 h-4" /> Return to Site
        </Link>
        <button className="w-full flex items-center gap-4 px-6 py-4 text-red-500/50 hover:text-red-500 transition-colors text-xs font-black uppercase tracking-widest">
          <LogOut className="w-4 h-4" /> Terminate Session
        </button>
      </div>
    </aside>
  );
}