export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-[var(--fg-3)] border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">Loading</span>
      </div>
    </div>
  );
}
