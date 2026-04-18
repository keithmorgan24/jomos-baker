'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Call the API to destroy the server-side cookie
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      
      if (response.ok) {
        // 2. Clear any lingering local identification
        localStorage.removeItem('userRole');
        
        // 3. Force a hard redirect to the login page
        router.push('/admin/login');
        router.refresh(); // Clears the server-side cache
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-4 p-4 rounded-2xl text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-all font-bold text-sm mt-auto group"
    >
      <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
      Logout System
    </button>
  );
}