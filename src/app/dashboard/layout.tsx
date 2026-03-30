'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const nav = [
  { href: '/dashboard', label: 'Overview', icon: '◇' },
  { href: '/dashboard/projects', label: 'Projects', icon: '▦' },
  { href: '/dashboard/experience', label: 'Experience', icon: '◈' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname === '/dashboard/login') return <>{children}</>;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/dashboard/login');
    router.refresh();
  };

  return (
    <div className="dashboard-layout min-h-screen bg-[#060606] flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#0a0a0a] border-r border-white/[0.04] transform transition-transform lg:relative lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="px-5 py-5 border-b border-white/[0.04]">
            <Link href="/" className="block">
              <span className="text-white text-xs font-medium tracking-[0.2em] uppercase">Portfolio</span>
              <span className="text-white/20 text-[8px] tracking-[0.3em] uppercase block mt-0.5">Dashboard</span>
            </Link>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {nav.map((item) => {
              const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-colors ${active ? 'bg-white/[0.06] text-white' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'}`}>
                  <span className="text-[10px]">{item.icon}</span>{item.label}
                </Link>
              );
            })}
          </nav>
          <div className="px-3 py-4 border-t border-white/[0.04] space-y-0.5">
            <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-colors">
              <span className="text-[10px]">↗</span>View Site
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-white/25 hover:text-red-400/70 hover:bg-white/[0.03] transition-colors">
              <span className="text-[10px]">⏻</span>Logout
            </button>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[#060606]/80 backdrop-blur-xl border-b border-white/[0.04] px-5 py-3.5 flex items-center justify-between">
          <button className="lg:hidden text-white/40 hover:text-white" onClick={() => setOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><rect y="3" width="20" height="1.5" rx="0.75" /><rect y="9" width="20" height="1.5" rx="0.75" /><rect y="15" width="20" height="1.5" rx="0.75" /></svg>
          </button>
          <div className="text-white/15 text-[9px] tracking-[0.3em] uppercase hidden lg:block">
            {nav.find((n) => n.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(n.href))?.label ?? 'Dashboard'}
          </div>
          <div className="text-white/10 text-[9px] font-mono">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
        </header>
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
