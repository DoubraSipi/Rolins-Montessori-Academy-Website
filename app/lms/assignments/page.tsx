'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type A = { id: string; title: string; due_date: string | null; max_points: number };
type S = { id: string; assignment_id: string; score: number | null; feedback: string | null };

export default function Assignments() {
  const [items, setItems] = useState<A[]>([]);
  const [subs, setSubs] = useState<S[]>([]);
  const [text, setText] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('Loading...');

  async function load() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) { setMsg('Sign in first.'); return; }
    const { data: a, error } = await supabase.from('lms_assignments').select('*').order('due_date');
    if (error) { setMsg(error.message); return; }
    setItems(a ?? []);
    const { data: s } = await supabase.from('lms_submissions').select('*').eq('student_id', user.user.id);
    setSubs((s ?? []) as S[]);
    setMsg('');
  }

  useEffect(() => { load(); }, []);

  async function submit(id: string) {
    setMsg('Submitting...');
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from('lms_submissions').upsert(
      { assignment_id: id, student_id: user.user!.id, feedback: text[id] || '' },
      { onConflict: 'assignment_id,student_id' }
    );
    setMsg(error ? error.message : 'Submitted.');
    load();
  }

  return (
    <>
      <h1>Assignments</h1>
      <p>{msg}</p>
      {items.map((a) => {
        const mine = subs.find((s) => s.assignment_id === a.id);
        return (
          <div key={a.id}>
            <h3>{a.title} (/{a.max_points})</h3>
            <p>Due: {a.due_date || '—'}{mine?.score != null && ` — Score: ${mine.score}`}</p>
            {mine?.feedback && <p>Teacher: {mine.feedback}</p>}
            <textarea placeholder="Your answer" value={text[a.id] || ''} onChange={(e) => setText({ ...text, [a.id]: e.target.value })} />
            <button onClick={() => submit(a.id)}>Submit</button>
          </div>
        );
      })}
    </>
  );
}
