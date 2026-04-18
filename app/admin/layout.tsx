import { 
  LayoutDashboard, 
  ShoppingBag, 
  Truck, 
  Utensils, 
  LogOut, 
  Bell, 
  Search, 
  Home, 
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// Note: We are removing AdminGuard and using Server-side validation instead

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. SERVER-SIDE SECURITY CHECK (Fixes HIGH-002)
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  // Get the current path to handle the login page exception
  // In Server Components, we don't have usePathname, but we can check headers
  // or simply let the middleware handle the login page logic.
  
  // 2. REDIRECT IF UNAUTHORIZED
  // This happens before a single pixel is sent to the browser
  if (!token) {
    redirect('/admin/login');
  }

  const sidebarLinks = [
    { label: 'Overview', icon: LayoutDashboard, href: '/admin' },
    { label: 'Dispatch', icon: ShoppingBag, href: '/admin/orders' },
    { label: 'Fleet Map', icon: Truck, href: '/admin/fleet' },
    { label: 'Menu Editor', icon: Utensils, href: '/admin/menu' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-zinc-100 font-sans selection:bg-amber-500/30">
      
      {/* 1. TOP ADMIN NAVBAR */}
      <header className="h-20 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-500 transition-all text-[10px] font-black uppercase tracking-widest group"
            >
              <Home size={14} className="group-hover:scale-110 transition-transform" />
              Exit to Site
            </Link>

            <div className="h-6 w-[1px] bg-zinc-800" />

            <div className="italic font-black text-xl tracking-tighter text-amber-500 uppercase">
              Jomo&apos;s <span className="text-zinc-100">Baker</span>
            </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col text-right pr-6 border-r border-zinc-900">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">System Live</span>
            <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Operational</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:text-amber-500 transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="p-2 text-zinc-400 hover:text-amber-500 transition-colors relative" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            </button>
            
            <Link href="/admin/orders" className="bg-zinc-100 text-zinc-950 px-6 py-2 rounded-full font-black italic uppercase text-[10px] tracking-wider hover:bg-amber-500 hover:text-white transition-all shadow-lg shadow-white/5">
              Live Orders
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. SIDEBAR NAVIGATION */}
        <aside className="w-72 border-r border-zinc-900 p-8 flex flex-col gap-10 bg-zinc-950">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
              Command Center
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
          
          <nav className="flex flex-col gap-2 flex-1">
            {sidebarLinks.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  className="flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-200 group"
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                </Link>
            ))}
          </nav>

          {/* 3. LOGOUT (Now requires an API call to clear the cookie) */}
          <LogoutButton /> 
        </aside>

        {/* 4. MAIN CONTENT AREA */}
        <main className="flex-1 p-12 overflow-y-auto bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Separate Client Component for the Logout Button to handle the interaction
import LogoutButton from '../components/LogoutButton';