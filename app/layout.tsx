'use client';

import { useState } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import CartSidebar from './components/CartSidebar';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 1. Logic: State must live inside the function body
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-zinc-950 text-zinc-100`}>
        {/* 2. Logic: Navbar now receives the trigger to open the cart */}
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        
        <main>{children}</main>

        {/* 3. Logic: Sidebar controlled by the layout state */}
        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />

        {/* 4. Logic: Toast listener sitting at the root */}
        <Toast /> 
      </body>
    </html>
  );
}