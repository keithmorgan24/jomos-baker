'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Retrieval logic from your production-ready login
    const role = localStorage.getItem('userRole'); 
    
    if (role !== 'admin') {
      router.push('/driver/login'); 
    } else {
      setAuthorized(true);
    }
  }, [router]);

  // Prevents the admin dashboard from "flickering" 
  // on the screen for a driver
  if (!authorized) return null; 

  return <>{children}</>;
}