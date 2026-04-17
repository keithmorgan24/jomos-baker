'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Utensils, ShoppingBag, Users, Settings } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Menu Items', href: '/admin/menu', icon: Utensils },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Fleet', href: '/admin/fleet', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 h-screen sticky top-0 p-6">
      <div className="mb-10">
        {/* Fixed: Use &apos; to escape apostrophes for ESLint */}
        <h1 className="text-xl font-black italic text-zinc-100 uppercase tracking-tighter">
          Jomo&apos;s <span className="text-amber-500">Admin</span>
        </h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-amber-500 text-zinc-950' 
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}