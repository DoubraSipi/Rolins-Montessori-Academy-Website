'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Sub = { id: string; assignment_id: string; student_id: string; feedback: string | null; score: number | null };

export default function TeacherAssignments() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [points, setPoints] = useState(100);
  const [grade, setGrade] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('Loading...');

  async function load() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) { setMsg('Sign in first.'); return; }
    const { data: mine } = await supabase.from('subjects').select('id').eq('teacher_id', user.user.id);
    const ids = (mine ?? []).map((s) => s.id);
    if (!ids.length) { setMsg('No subjects assigned.'); return; }
    const { data: asg } = await supabase.from('lms_assignments').select('id').in('subject_id', ids);
    const aids = (asg ?? []).map((a) => a.id);
    if (!aids.length) { setSubs([]); setMsg('No submissions yet.'); return; }
    const { data: s, error } = await supabase.from('lms_submissions').select('*').in('assignment_id', aids);
    if (error) { setMsg(error.message); return; }
    setSubs((s ?? []) as Sub[]);
    setMsg('');
  }

  useEffect(() => { load(); }, []);

  async function create() {
    setMsg('Creating...');
    const { data: user } = await supabase.auth.getUser();
    const { data: mine } = await supabase.from('subjects').select('id').eq('teacher_id', user.user!.id).limit(1).single();
    const { error } = await supabase.from('lms_assignments').insert({
      subject_id: mine!.id, title, due_date: due || null, max_points: points,
    });
    setMsg(error ? error.message : 'Created.');
    if (!error) { setTitle(''); setDue(''); }
  }

  async function saveGrade(s: Sub) {
    const [score, ...fb] = (grade[s.id] || '').split('|');
    const { error } = await supabase.from('lms_submissions').update({
      score: Number(score), feedback: fb.join('|'),
    }).eq('id', s.id);
    setMsg(error ? error.message : 'Graded.');
    load();
  }

  return (
    <>
      <h1>Teacher assignments</h1>
      <p>{msg}</p>
      <h3>New assignment</h3>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
      <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
      <button onClick={create}>Create</button>
      <h3>Submissions</h3>
      {subs.map((s) => (
        <div key={s.id}>
          <p>{s.student_id.slice(0, 8)} — score: {s.score ?? '—'}</p>
          <p>Answer: {s.feedback || '—'}</p>
          <input placeholder="score|feedback" value={grade[s.id] || ''} onChange={(e) => setGrade({ ...grade, [s.id]: e.target.value })} />
          <button onClick={() => saveGrade(s)}>Save grade</button>
        </div>
      ))}
    </>
  );
}
