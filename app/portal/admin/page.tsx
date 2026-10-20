'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Admission = {
  id: string;
  pupil_name: string;
  entry_class: string;
  parent_contact: string;
  status: string;
  created_at: string;
};

export default function AdminPortal() {
  const [rows, setRows] = useState<Admission[]>([]);
  const [msg, setMsg] = useState('Loading...');

  useEffect(() => {
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) { setMsg('Sign in first.'); return; }
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.user.id).maybeSingle();
      if (prof?.role !== 'admin') { setMsg('This area is for administrators.'); return; }
      const { data, error } = await supabase.from('admissions').select('*').order('created_at', { ascending: false });
      if (error) { setMsg(error.message); return; }
      setRows((data ?? []) as Admission[]);
      setMsg('');
    })();
  }, []);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from('admissions').update({ status }).eq('id', id);
    if (error) { setMsg(error.message); return; }
    setRows(rows.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div className="bg-slate-50 py-10">
      <div className="container-x">
        <span className="eyebrow">Administration</span>
        <h1 className="text-3xl sm:text-4xl">Admissions inbox</h1>
        <p className="mt-2 text-slate-600">Every enquiry from the website lands here.</p>

        <p className="mt-4 text-sm text-slate-600">{msg}</p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-brand-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Received</th>
                <th className="px-4 py-3 text-left">Pupil</th>
                <th className="px-4 py-3 text-left">Entry class</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="odd:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{r.pupil_name}</td>
                  <td className="px-4 py-3">{r.entry_class}</td>
                  <td className="px-4 py-3">{r.parent_contact}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => setStatus(r.id, e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                    >
                      {['new', 'contacted', 'tour booked', 'admitted', 'closed'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
