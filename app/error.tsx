'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your console for debugging
    console.error("🚨 APPLICATION_CRASH:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-black text-zinc-100 mb-4 uppercase tracking-tighter italic">
          Something went wrong
        </h2>
        <p className="text-zinc-500 mb-6 text-sm">
          {error.message || "The baker dropped a tray. We're cleaning it up."}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-amber-500 text-zinc-950 font-bold rounded-lg hover:bg-amber-600 transition-all active:scale-95"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}