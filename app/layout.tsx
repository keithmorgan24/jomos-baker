'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation'; 
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// FIX: Updated to './' because the components folder is INSIDE the app folder.
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import CartSidebar from './components/CartSidebar';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();

  // Identify if the user is in the admin section to avoid UI overlap
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 text-zinc-100 antialiased`}
      >
        {/* Only render public UI elements if we are NOT on an admin page */}
        {!isAdminPage && (
          <>
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <Toast />
          </>
        )}

        <main>{children}</main>
      </body>
    </html>
  );
}