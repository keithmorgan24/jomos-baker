export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-zinc-500 font-medium animate-pulse">
          Preparing Jomo's Baker...
        </p>
      </div>
    </div>
  );
}