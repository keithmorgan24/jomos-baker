'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch('/api/admin/verify');
        if (res.ok) {
          setAuthorized(true);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    validate();
  }, [router]);

  if (loading) return <div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Checking Credentials...</div>;
  if (!authorized) return null;

  return <>{children}</>;
}