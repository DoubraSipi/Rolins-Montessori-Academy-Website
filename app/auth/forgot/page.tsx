'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg('Sending...');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    setMsg(
      error
        ? error.message
        : 'If that email is registered, a reset link is on its way. Check your inbox and spam folder.'
    );
    setBusy(false);
  }

  return (
    <section className="bg-slate-50 py-20">
      <div className="container-x max-w-md">
        <div className="card">
          <span className="eyebrow">Portal</span>
          <h1 className="text-3xl">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter the email you use for the portal and we will send you a reset link.
          </p>

          <form onSubmit={send} className="mt-7 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? 'Sending…' : 'Send reset link'}
            </button>
            {msg && <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">{msg}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
