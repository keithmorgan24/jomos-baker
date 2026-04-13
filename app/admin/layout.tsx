'use client';

import { LayoutDashboard, ShoppingBag, Truck, Utensils, LogOut, Bell, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';
  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-zinc-100 font-sans">
      
      {/* 1. TOP APP NAVBAR (Fixed at the top) */}
      <header className="h-20 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
           <div className="italic font-black text-2xl tracking-tighter text-amber-500 uppercase">
             Jomo's <span className="text-zinc-100">Baker</span>
           </div>
           
           {/* Navigation Links - Corrected to point to actual routes */}
           <nav className="hidden md:flex items-center gap-6 ml-10">
             <Link href="/" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-500 transition-colors flex items-center gap-2">
               Home <ExternalLink size={12} />
             </Link>
             <Link href="/admin/menu" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-500 transition-colors">
               Menu
             </Link>
             <Link href="/admin/fleet" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-500 transition-colors">
               Services
             </Link>
             <Link href="mailto:support@jomosbaker.co.ke" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-500 transition-colors">
               Contact
             </Link>
           </nav>
        </div>

        <div className="flex items-center gap-6">
          <button className="p-2 text-zinc-500 hover:text-amber-500 transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 text-zinc-500 hover:text-amber-500 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-zinc-950"></span>
          </button>
          <Link href="/admin/orders" className="bg-amber-500 text-zinc-950 px-6 py-2 rounded-full font-black italic uppercase text-sm hover:bg-white transition-all shadow-lg shadow-amber-500/10">
            Live Orders
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 2. SIDEBAR NAVIGATION */}
        <aside className="w-72 border-r border-zinc-800 p-8 flex flex-col gap-10 sticky top-20 h-[calc(100vh-5rem)]">
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
            Command Center
          </div>
          
          <nav className="flex flex-col gap-3 flex-1">
            {[
              { label: 'Overview', icon: LayoutDashboard, href: '/admin' },
              { label: 'Dispatch', icon: ShoppingBag, href: '/admin/orders' },
              { label: 'Fleet Map', icon: Truck, href: '/admin/fleet' },
              { label: 'Menu Editor', icon: Utensils, href: '/admin/menu' },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${
                    isActive 
                    ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20' 
                    : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button 
            onClick={() => router.push('/admin/login')}
            className="flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm mt-auto"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}