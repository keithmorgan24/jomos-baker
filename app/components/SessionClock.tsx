'use client';

import { useState, useEffect } from 'react';

export default function SessionClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Prevent any text from showing until the component is mounted in the browser
  if (!mounted) {
    return (
      <div className="text-right border-r border-zinc-800 pr-10">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-0.5">Current Session</div>
        <div className="font-mono text-[11px] tracking-[0.2em] text-zinc-700">SYNCING...</div>
      </div>
    );
  }

  const format = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} // ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  return (
    <div className="text-right border-r border-zinc-800 pr-10">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-0.5">
        Current Session
      </div>
      <div className="font-mono text-[11px] tracking-[0.2em] text-amber-500/80 min-w-[180px]">
        {format(time)}
      </div>
    </div>
  );
}