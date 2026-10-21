'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('Checking your link…');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setMsg('Link verified. Choose a new password.');
        setReady(true);
      } else {
        setMsg('This reset link is invalid or has expired. Request a new one from the login page.');
      }
    })();
  }, []);

  async function update(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setMsg('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setMsg('Passwords do not match.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setMsg(error ? error.message : 'Password updated. You can now sign in.');
    setBusy(false);
  }

  return (
    <section className="bg-slate-50 py-20">
      <div className="container-x max-w-md">
        <div className="card">
          <span className="eyebrow">Portal</span>
          <h1 className="text-3xl">Choose a new password</h1>

          {ready ? (
            <form onSubmit={update} className="mt-7 space-y-4">
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
              />
              <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
                {busy ? 'Saving…' : 'Update password'}
              </button>
            </form>
          ) : null}

          <p className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{msg}</p>
        </div>
      </div>
    </section>
  );
}
