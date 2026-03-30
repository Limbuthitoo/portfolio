'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout min-h-screen bg-[#060606] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-white text-lg font-light tracking-wider mb-2">Dashboard</h1>
          <p className="text-white/25 text-[9px] tracking-[0.3em] uppercase">Portfolio Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="text-white/30 text-[9px] uppercase tracking-[0.25em] block mb-2">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-white/20 text-white text-sm px-4 py-3 rounded-lg outline-none transition-colors"
              placeholder="Enter dashboard password" required autoFocus
            />
          </div>
          {error && <p className="text-red-400/70 text-[10px] text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-white/[0.06] hover:bg-white/10 disabled:opacity-50 text-white text-[9px] uppercase tracking-[0.3em] py-3 rounded-lg transition-colors">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
