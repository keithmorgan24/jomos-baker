'use client';

import { useState } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// FIX: Changed paths from '@/components/...' to './components/...' 
// because your components folder is inside the app directory.
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import CartSidebar from './components/CartSidebar';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.className} bg-zinc-950 text-zinc-100 antialiased`}>
        {/* Navbar trigger for the Cart */}
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        
        <main>{children}</main>

        {/* Sidebar controlled by layout state */}
        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />

        {/* Toast listener */}
        <Toast /> 
      </body>
    </html>
  );
}