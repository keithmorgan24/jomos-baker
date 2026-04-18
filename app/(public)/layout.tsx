'use client';

import { useState } from 'react';

// 🛡️ SECURITY & STYLE CHECK: 
// Removed 'globals.css' from here because it's already in the Root Layout.
// We only import the components that belong to the customer world.

import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import CartSidebar from '../components/CartSidebar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      {/* These only show up for the public site */}
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      
      <Toast />

      {/* This is where your homepage content (page.tsx) will sit */}
      <main>{children}</main>
    </>
  );
}