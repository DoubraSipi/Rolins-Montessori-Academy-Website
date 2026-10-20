'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg('Signing in...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : 'Signed in.');
    setBusy(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setMsg('Signed out.');
  }

  return (
    <section className="bg-slate-50 py-20">
      <div className="container-x max-w-md">
        <div className="card">
          <span className="eyebrow">Portal</span>
          <h1 className="text-3xl">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            For teachers, students, parents and administrators.
          </p>

          <form onSubmit={signIn} className="mt-7 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-4 pr-12 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-brand-700"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={busy} className="btn-primary flex-1 disabled:opacity-60">
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
              <button type="button" onClick={signOut} className="btn-outline">
                Sign out
              </button>
            </div>

            {msg && (
              <p
                className={`rounded-xl px-4 py-3 text-sm ${
                  msg.startsWith('Signed in')
                    ? 'bg-brand-50 text-brand-800'
                    : msg.startsWith('Signed out')
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-amber-50 text-amber-800'
                }`}
              >
                {msg}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
