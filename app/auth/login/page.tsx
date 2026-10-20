'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function signIn() {
    setMsg('Signing in...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : 'Signed in.');
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

          <div className="mt-7 space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
            />
            <div className="flex gap-3">
              <button onClick={signIn} className="btn-primary flex-1">Sign in</button>
              <button onClick={signOut} className="btn-outline">Sign out</button>
            </div>
            {msg && <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">{msg}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
